sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("project2.controller.homeAccount", {

		onInit: function () {
			this.getOwnerComponent().getRouter().getRoute("homeAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched: async function () {
			this.onDataAccNum();
			this.onDataCmpCode();
		},
		onDataAccNum: async function () {
			let GLAcc = await $.ajax({			//최근 생성된 AccNum 3개
				type: "GET",
				url: "/account/GLAcc?$orderby=createDate desc&$top=3"
			})
			let RctGLAccModel = new JSONModel(GLAcc.value);
			this.getView().setModel(RctGLAccModel, "RctGLAccModel")
		},
		onDataCmpCode: async function () {
			let CmpCount;
			let OCmp = {};
			let ACmp = [];
			let cCodeName;
			let CmpKey = [];
			let CmpValue = [];
			let Arr = [];

			let GLAcc = await $.ajax({			//회사코드 3개 
				type: "GET",
				url: "/account/CmpCode"
			})
			CmpCount = GLAcc.value.length		//회사코드 개수 뽑아와서

			for (let i = 0; i < CmpCount; i++) {		//그 수만큼 반복 회사별 accNum 개수

				let CmpCode = await $.ajax({			//회사코드 3개 
					type: "GET",
					url: "/account/GLAcc?$filter=cmpCodeKey eq '" + GLAcc.value[i].cmpCode + "'&$count=true"
				})
				cCodeName = GLAcc.value[i].cmpCode;		//회사 이름을 변수에 넣고

				CmpKey.push(cCodeName);					//회사 이름 넣은 변수를 배열에 넣고
				CmpValue.push(CmpCode.value.length);	//회사가 가진 GLNum 개수 배열에 넣고

				OCmp[cCodeName] = CmpCode.value.length	//회사 이름과 GLNum 개수를 객체에 넣음

			}
			// console.log(OCmp)		
			ACmp = Object.entries(OCmp);								// 2차원배열
			for (let i = 0; i < CmpCount; i++) {
				Arr[i] = { name: ACmp[i][0], num: ACmp[i][1] } 			// 배열[객체] => [ {회사코드1:계정개수}, {회사코드2:계정개수}, ...]				
			}

			let soringField = "num";									// 계정개수로 내림차순 정렬
			Arr.sort(function (a, b) {
				return b[soringField] - a[soringField];
			})

			let master =[{},{},{}];									//회사코드와 계정과목 개수를 담을 객체 배열을 선언	
			for(let i=0; i<3; i++) {								// top 3 회사코드와 각 계정개수를 master배열에 담기
				let cmppp = await $.ajax({
					type: "GET",
					url: "/account/GLAcc?$search=" + Arr[i].name + "&$count=true"
				})
				Object.assign(master[i], { name: cmppp.value[0].cmpCodeKey, count: cmppp.value.length });
			}
			console.log(master);

			let CmpCodeModel = new JSONModel(master);			//담은 데이터를 JSONModel로 
			this.getView().setModel(CmpCodeModel, "CmpCodeModel")
		},
		onNavToDetail: function (e) {
			var sPath = e.getSource().oBindingContexts.RctGLAccModel.sPath;
			var selectedNum = this.getView().getModel("RctGLAccModel").getProperty(sPath).ID;
			let chartAccount = 1;
			this.getOwnerComponent().getRouter().navTo("detailAccount", { num: chartAccount, ID: selectedNum });
		},
		onAccount: function () {
			this.getOwnerComponent().getRouter().navTo("Account", {name: 1});
		},
		oncreateAccount: function () {
			let homeAccount = 1
			this.getOwnerComponent().getRouter().navTo("createAccount", { num: homeAccount });
		},
		// onSearch: function(e) {
		// 	var sPath = e.getSource().oBindingContexts.CmpCodeModel.sPath;
		// 	var selectedName = this.getView().getModel("CmpCodeModel").getProperty(sPath).name;
		// 	console.log(selectedName)
			
        //     this.getOwnerComponent().getRouter().navTo("Account", { name: selectedName });
		// }
	});
});