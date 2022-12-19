sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	var SelectedNum;

	return Controller.extend("project2.controller.detailAccount", {
		onInit: async function() {
			this.getOwnerComponent().getRouter().getRoute("detailAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
		},
		onMyRoutePatternMatched: async function(e) {
			SelectedNum = e.getParameter("arguments").num;
			console.log(SelectedNum)
			let Account = await $.ajax({
				type: "get",
				url: "/account/Account/" + SelectedNum
			});
			console.log(Account)
			let AccountModel = new JSONModel(Account);
			console.log(AccountModel)
			this.getView().setModel(AccountModel, "AccountModel");

		},
		onBack: function() {
			this.getOwnerComponent().getRouter().navTo("Account");
	}
	});
});