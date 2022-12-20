sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/Cformatter"
], function(
    Controller, JSONModel, Cformatter
) {
    "use strict";

    return Controller.extend("project3.controller.detailCustomerO", {
        Cformatter: Cformatter,

        onInit: function(){

            this.getOwnerComponent().getRouter().getRoute("detailCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(oEvent){
            var SelectedNum = oEvent.getParameter("arguments").num;
            console.log(SelectedNum);
            let url = "/customer/Customer/" + SelectedNum;
            console.log(url);

            const Customer = await $.ajax({
                type: "get",
                url: url
              });
              console.log(Customer);

            let CustomerModel = new JSONModel(Customer);
            this.getView().setModel(CustomerModel, "CustomerModel");

            console.log(this.getView().getModel("CustomerModel"));
        },

        onChange: function() {
            var SelectedNum = this.byId("customerNumber").mProperties.text;
            // console.log(SelectedNum);
    
    
                this.getOwnerComponent().getRouter().navTo("changeCustomerO", {num:SelectedNum})
            
        },
        
        onCustomer: function() {
            this.getOwnerComponent().getRouter().navTo("Customer")

        }

    });
});