sap.ui.define([], function (){
    "use strict";
    return {
        statusText: function (sStatus) {
            switch (sStatus) {
                case "A":
                    return "생산";
                case "B":
                                    return "미 사용";
                case "C":
                    return "단종 예정";
                case "D":
                    return "단종";
                default:
                    return sStatus;    
            }   
        }
    };
});