sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project3.controller.changeCustomerP", {
        
        
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("changeCustomerP").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(){

        },
        
        onConfirm: function() {

        },

        onCancel: function() {
            this.getOwnerComponent().getRouter().navTo("detailCustomerP")
        }
      });
    }
  );
  