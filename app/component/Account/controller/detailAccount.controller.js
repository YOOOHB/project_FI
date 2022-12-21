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
			this.getOwnerComponent().getRouter().getRoute("detailAccount").attachPatternMatched(this.onRecordNum, this);
			this.getOwnerComponent().getRouter().getRoute("detailAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onRecordNum: function (e) {
			ID = e.getParameter("arguments").ID;
			num = e.getParameter("arguments").num;
			console.log(e.getParameters())
			console.log(e.getParameter("arguments"))
		},
		onMyRoutePatternMatched: async function () {
			this.onDataGLAcc();
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
			this.byId("selectGLNum").getSelectedKey();
            this.getOwnerComponent().getRouter().navTo("detailAccount", {num: num, ID: sId});
		},
		onBack: function () {
			if (num == "1") {
				this.getOwnerComponent().getRouter().navTo("chartAccount");
			} else if (num == "2") {
				this.getOwnerComponent().getRouter().navTo("Account");
			}
		}
	});
});