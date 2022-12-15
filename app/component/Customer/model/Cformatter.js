sap.ui.define([
    
],
    function () {
        "use strict";

        return  {
            statusText: function (sStatus) {
                switch (sStatus) {
                    case "A":
                        return "개인(1)";
                    case "B":
                        return "조직(2)";
                    default:
                        return sStatus;
                }
            }
        
    };  

});