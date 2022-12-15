sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(
    Controller
) {
    "use strict";

    return Controller.extend("project2.controller.homeAccount", {
<<<<<<< HEAD

        
=======
        onAccount: function() {
            this.getOwnerComponent().getRouter().navTo("Account");
        }
>>>>>>> c8e6de1fd173e7194fccedd7adca01b1a8cf2c7b
    });
});