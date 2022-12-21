sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	return Controller.extend("project2.controller.chartAccount", {	
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("chartAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);

		
		},
		onMyRoutePatternMatched: async function() {			//최근 생성된 AccNum 3개
			let GLAcc = await $.ajax({
				type: "GET",
				url: "/account/GLAcc?$orderby=createDate desc&$top=3"
			})
			let RctGLAccModel = new JSONModel(GLAcc.value);
			this.getView().setModel(RctGLAccModel, "RctGLAccModel")
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