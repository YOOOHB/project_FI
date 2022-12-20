sap.ui.define([
    
],
    function () {
        "use strict";

        return  {
            statusText: function (sStatus) {
                switch (sStatus) {
                    case true:
                        return "Y";
                    case false:
                        return "N";
                    default:
                        return sStatus;
                }
            }
        
    };  

});