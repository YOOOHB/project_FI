sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },
        onAccount: function() {
          this.getOwnerComponent().getRouter().navTo("Account");
        },
        onCustomer: function() {
          this.getOwnerComponent().getRouter().navTo("Customer");
        },
        onHome: function() {
          this.getOwnerComponent().getRouter().navTo("home"); 
        }
      });
    }
  );
  