sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function(
    Controller, JSONModel, Fragment
) {
    "use strict";

    return Controller.extend("project3.controller.detailCustomerP", {

        onInit: function(){

            this.getOwnerComponent().getRouter().getRoute("detailCustomerP").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(){

        },

        onChange: function() {
            this.getOwnerComponent().getRouter().navTo("changeCustomerP")
            
        },
        
        onCustomer: function() {
            this.getOwnerComponent().getRouter().navTo("Customer")

        }

    });
});