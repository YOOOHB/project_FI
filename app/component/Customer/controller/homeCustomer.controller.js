sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project3.controller.homeCustomer", {

        onCustomer:function() {
            this.getOwnerComponent().getRouter().navTo("Customer")
        }
    });
});