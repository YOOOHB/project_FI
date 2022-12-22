sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project1.controller.home", {
        onAccount: function() {
            this.getOwnerComponent().getRouter().navTo("Account");
            this.getView().getModel("menuModel").setProperty("/menu", "G/L 계정과목 관리");
          },
          
          onCustomer: function() {
            this.getOwnerComponent().getRouter().navTo("Customer");
            this.getView().getModel("menuModel").setProperty("/menu", "BP(고객마스터) 관리");
          },
    });
});