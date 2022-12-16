sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project3.controller.detailCustomerO", {

        onInit: function(){

            this.getOwnerComponent().getRouter().getRoute("detailCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(){

        },

        onChange: function() {
            this.getOwnerComponent().getRouter().navTo("changeCustomerO")
            
        },
        
        onCustomer: function() {
            this.getOwnerComponent().getRouter().navTo("Customer")

        }

    });
});