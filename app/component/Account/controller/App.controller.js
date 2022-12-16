sap.ui.define(
  [
      "sap/ui/core/mvc/Controller"
  ],
  function(BaseController) {
    "use strict";

    return BaseController.extend("project2.controller.App", {
      onInit() {
        
      },

      onRequest: function() {
        this.getOwnerComponent().getRouter().navTo("Account");
      },
      onCompany: function() {
        this.getOwnerComponent().getRouter().navTo("Customer");
      }
    });
  }
);
