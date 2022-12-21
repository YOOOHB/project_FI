sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(
    Controller, JSONModel
) {
    "use strict";

    return Controller.extend("project3.controller.homeCustomer", {

        onInit: function() {
            this.getOwnerComponent().getRouter().getRoute("homeCustomer").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("changeCustomerP").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("changeCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        onMyRoutePatternMatched: async function() {
            const orderHold = await $.ajax({
                type: "get",
                url: "/customer/Customer?$orderby=createDate&$filter=orderHold_key eq 'A' or orderHold_key eq 'B' or orderHold_key eq 'C'&$top=3"
            });

            let orderHoldModel = new JSONModel(orderHold.value);
            this.getView().setModel(orderHoldModel,"orderHoldModel")

            const requestHold = await $.ajax({
                type: "get",
                url: "/customer/Customer?$orderby=createDate&$filter=requestHold_key eq 'A' or requestHold_key eq 'B' or requestHold_key eq 'C' or requestHold_key eq 'D' or requestHold_key eq 'E'&$top=3"
            });

            let requestHoldModel = new JSONModel(requestHold.value);
            this.getView().setModel(requestHoldModel,"requestHoldModel")
        },

        onCustomer:function() {
            this.getOwnerComponent().getRouter().navTo("Customer")
        },

        oncreateCustomerP:function() {
            this.getOwnerComponent().getRouter().navTo("createCustomerP")
        },

        oncreateCustomerO:function() {
            this.getOwnerComponent().getRouter().navTo("createCustomerO")
        },

        onDetailPageOrder: function(oEvent) {
            let dPath = oEvent.getSource().oBindingContexts.orderHoldModel.sPath;

            var data = this.getView().getModel("orderHoldModel").getProperty(dPath);

            var num = data.customerNumber;

            if(data.bpRange === 'A'){
                this.getOwnerComponent().getRouter().navTo("detailCustomerP", {num:num})
            }else if(data.bpRange === 'B'){
                this.getOwnerComponent().getRouter().navTo("detailCustomerO", {num:num})
            }
        },

        onDetailPageRequest: function(oEvent) {
            let dPath = oEvent.getSource().oBindingContexts.requestHoldModel.sPath;

            var data = this.getView().getModel("requestHoldModel").getProperty(dPath);

            var num = data.customerNumber;

            if(data.bpRange === 'A'){
                this.getOwnerComponent().getRouter().navTo("detailCustomerP", {num:num})
            }else if(data.bpRange === 'B'){
                this.getOwnerComponent().getRouter().navTo("detailCustomerO", {num:num})
            }
        }
    });
});