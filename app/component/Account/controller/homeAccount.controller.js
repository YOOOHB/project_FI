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
            let homeAccount = 1
            this.getOwnerComponent().getRouter().navTo("createAccount", {num: homeAccount});
        },
        onchartAccount: function() {
            this.getOwnerComponent().getRouter().navTo("chartAccount");
        }

    });
});