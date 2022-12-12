sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
        },

        onHome: function() {
          this.getOwnerComponent().getRouter().navTo("home");
        },
        
        onMenuEvent: function(oEvent) {
          let a = oEvent.getParameter("item");

        },

        onRequest: function() {
          this.getOwnerComponent().getRouter().navTo("Request");
        },
        onCompany: function() {
          this.getOwnerComponent().getRouter().navTo("Partner");
        }
        ,
        onMaterial: function() {
          this.getOwnerComponent().getRouter().navTo("Material");
        }
      });
    }
  );
  