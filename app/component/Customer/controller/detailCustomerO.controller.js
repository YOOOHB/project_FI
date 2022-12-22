sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/Cformatter",
    "../model/Pformatter"
], function(
    Controller, JSONModel, Cformatter, Pformatter
) {
    "use strict";

    let ID;

    return Controller.extend("project3.controller.detailCustomerO", {
        Cformatter: Cformatter,
        Pformatter: Pformatter,

        onInit: function(){

            this.getOwnerComponent().getRouter().getRoute("detailCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("changeCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("homeCustomer").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(oEvent){
            ID = oEvent.getParameter("arguments").ID;
            console.log(ID);

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
            
            if (ID == "1") {
                this.getOwnerComponent().getRouter().navTo("changeCustomerO", {num:SelectedNum, number:1});
              } else if (ID == "2") {
                this.getOwnerComponent().getRouter().navTo("changeCustomerO", {num:SelectedNum, number:2})
              }
            
        },
        
        onCustomer: function() {
            if (ID == "1") {
                this.getOwnerComponent().getRouter().navTo("homeCustomer");
              } else if (ID == "2") {
                this.getOwnerComponent().getRouter().navTo("Customer");
              }

        }

    });
});