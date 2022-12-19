sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController, JSONModel) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
          var abc = {
            menu: "Home",
          };
          let menuModel = new JSONModel(abc);
          this.getView().setModel(menuModel, "menuModel");
        },
        onAccount: function() {
          this.getOwnerComponent().getRouter().navTo("Account");
          this.getView().getModel("menuModel").setProperty("/menu", "G/L 계정과목 조회");
        },
        onCustomer: function() {
          this.getOwnerComponent().getRouter().navTo("Customer");
          this.getView().getModel("menuModel").setProperty("/menu", "BP(고객마스터) 관리");
        },
        onHome: function() {
          this.getOwnerComponent().getRouter().navTo("home"); 
          this.getView().getModel("menuModel").setProperty("/menu", "Home");
        }
      });
    }
  );
  