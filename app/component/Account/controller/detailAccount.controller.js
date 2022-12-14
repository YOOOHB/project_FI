sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/aFormatter"
], function (Controller, JSONModel, aFormatter) {
	"use strict";
	let num;
	let ID;
	return Controller.extend("project2.controller.detailAccount", {
		formatter: aFormatter,
		onInit: async function () {
			this.getOwnerComponent().getRouter().getRoute("detailAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched: function (e) {
			ID = e.getParameter("arguments").ID;
			num = e.getParameter("arguments").num;
			
			this.byId("selectGLNum").setSelectedKey(ID);
			this.onDataGLAccAll();
			this.onDataGLAcc();
		},
		onDataGLAccAll: async function() {
			let Account = await $.ajax({
				type: "get",
				url: "/account/GLAcc"
			});
			let accModel = new JSONModel(Account.value);
			this.getView().setModel(accModel, "accModel");
		},
		onDataGLAcc: async function () {
			//GLModel
			let Account = await $.ajax({
				type: "get",
				url: "/account/GLAcc?$filter=ID eq '" + ID + "'"
			});

			let AccountModel = new JSONModel(Account.value[0]);
			let CmpCodeKey = Account.value[0].cmpCodeKey
			this.getView().setModel(AccountModel, "AccountModel");

			//CmpModel
			let CmpCode = await $.ajax({
				type: "get",
				url: "/account/CmpCode?$filter=cmpCode eq '" + CmpCodeKey + "'"
			});
			let CmpCodeModel = new JSONModel(CmpCode.value[0]);
			this.getView().setModel(CmpCodeModel, "CmpCodeModel");

		},
		onChangeAccNum: function() {
			ID = this.byId("selectGLNum").getSelectedKey();
			// console.log(key);
            // this.getOwnerComponent().getRouter().navTo("detailAccount", {num: num, ID: key});
			this.onDataGLAcc();
		},
		onBack: function () {
			if (num == "1") {
				this.getOwnerComponent().getRouter().navTo("homeAccount");
			} else if (num == "2") {
				this.getOwnerComponent().getRouter().navTo("Account", {name: 1});
			}
		}
	});
});