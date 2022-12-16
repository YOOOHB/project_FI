sap.ui.define([], function (){
    "use strict";
    return {
        statusText: function (sStatus) {
            switch (sStatus) {
                case "P":
                    return "1차 원가 또는 수익";
                case "S":
                    return "2차 원가";
                case "X":
                    return "대차대조표 계정";
                case "N":
                    return "영업 외 비용 또는 수익";
                case "C":
                    return "현금 계정";    
                default:
                    return sStatus;
            }
        }
    };
});