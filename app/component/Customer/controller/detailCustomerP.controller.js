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
        
        onMyRoutePatternMatched: async function(oEvent){
            var SelectedNum = oEvent.getParameter("arguments").num;
            console.log(oEvent.getParameter("arguments"));
            let url = "/customer/Customer" + SelectedNum;
            console.log(url);
        },

        onChange: function() {
            this.getOwnerComponent().getRouter().navTo("changeCustomerP")
            
        },
        
        onCustomer: function() {
            this.getOwnerComponent().getRouter().navTo("Customer")

        }

    });
});