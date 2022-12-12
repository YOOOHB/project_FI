sap.ui.define([], function (){
    "use strict";
    return {
        statusText: function (sStatus) {
            switch (sStatus) {
                case "A":
                    return "신뢰";
                case "B":
                    return "보류";
                case "C":
                    return "주의";
                default:
                    return sStatus;    
            }   
        }
    };
});