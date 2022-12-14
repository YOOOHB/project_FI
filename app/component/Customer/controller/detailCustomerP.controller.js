sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(
    Controller, JSONModel
) {
    "use strict";

    return Controller.extend("project3.controller.detailCustomerP", {

        onInit: function(){

            this.getOwnerComponent().getRouter().getRoute("detailCustomerP").attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function(){
            var visible = {
                edit: false,
            };
    
            let editModel = new JSONModel(visible);
    
            this.getView().setModel(editModel,"editModel");
            console.log(editModel);

        },

        onEdit: function() {
            this.getView().getModel("editModel").setProperty("/edit", true);
        },

        onCustomer: function() {

        }

    });
});