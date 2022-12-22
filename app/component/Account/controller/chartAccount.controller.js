sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("project2.controller.chartAccount", {	
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("chartAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched: async function() {
			this.onDataAccNum();
			this.onDataCmpCode();
		},
		onDataAccNum: async function() {
			let GLAcc = await $.ajax({			//최근 생성된 AccNum 3개
				type: "GET",
				url: "/account/GLAcc?$orderby=createDate desc&$top=3"
			})
			let RctGLAccModel = new JSONModel(GLAcc.value);
			this.getView().setModel(RctGLAccModel, "RctGLAccModel")
		},
		onDataCmpCode: async function() {
			let CmpCount;
			let OCmp = {};
			let ACmp = [];
			let cCodeName;
			let CmpKey =[];
			let CmpValue =[];
			
			let GLAcc = await $.ajax({			//회사코드 3개 
				type: "GET",
				url: "/account/CmpCode"
			})
			CmpCount = GLAcc.value.length		//회사코드 개수 뽑아와서
			
			for(let i=0; i<CmpCount; i++) {		//그 수만큼 반복 회사별 accNum 개수
				
				let CmpCode = await $.ajax({			//회사코드 3개 
					type: "GET",
					url: "/account/GLAcc?$filter=cmpCodeKey eq '" + GLAcc.value[i].cmpCode + "'&$count=true"
				})
				cCodeName = GLAcc.value[i].cmpCode;		//회사 이름을 변수에 넣고

				CmpKey.push(cCodeName);					//회사 이름 넣은 변수를 배열에 넣고
				CmpValue.push(CmpCode.value.length);	//회사가 가진 GLNum 개수 배열에 넣고
				OCmp[cCodeName] = CmpCode.value.length;	//회사 이름과 GLNum 개수를 객체에 넣음
			}
			ACmp = Object.entries(OCmp);				//객체를 회사이름,GLNum 형태의 배열로 변환
			ACmp.sort(function (a,b) {
				return a-b;
			});
					
			console.log(OCmp)
			console.log(CmpKey)
			console.log(CmpValue)

			
			// this.getView().setModel(CmpCodeModel, "CmpCodeModel")




2


		},
		onNavToDetail: function(e) {
			var sPath = e.getSource().oBindingContexts.RctGLAccModel.sPath;
			var selectedNum = this.getView().getModel("RctGLAccModel").getProperty(sPath).ID;
			let chartAccount = 1;
			this.getOwnerComponent().getRouter().navTo("detailAccount", {num: chartAccount, ID: selectedNum});
		},
        onhomeAccount: function () {
            this.getOwnerComponent().getRouter().navTo("homeAccount");
        }
	});
});