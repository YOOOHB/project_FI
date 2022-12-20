sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project2.controller.homeAccount", {


        onAccount: function() {
            this.getOwnerComponent().getRouter().navTo("Account");
        },

        oncreateAccount: function() {
            this.getOwnerComponent().getRouter().navTo("createAccount");
        }

    });
});