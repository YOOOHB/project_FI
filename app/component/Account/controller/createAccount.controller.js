sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
], function (Controller, Fragment, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project2.controller.createAccount", {
                onInit: async function(){
                        this.getOwnerComponent().getRouter().getRoute("createAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
                },
                onMyRoutePatternMatched: async function(){
                let Account = await $.ajax({
                        type: "get",
                        url: "/account/Account"
                });
                let AccountModel= new JSONModel(Account.value);
                this.getView().setModel(AccountModel, "AccountModel");
                },


        //createAccount
                onCreate: function () {                 // createAccount 생성 버튼

                },
                onBack: function () {                   // createAccount 취소 버튼, 상단 백버튼
                        this.getOwnerComponent().getRouter().navTo("Account");
                },

        // GLAccount Dialog
                onOpenGLAccount: function () {                  // G/L Account Dialog open
                        if (!this.byId("GLAccount")) {
                                Fragment.load({
                                id: this.getView().getId(),
                                name: "project2.view.fragment.GLAccount",
                                controller: this
                                }).then(function (oDialog) {                          
                                this.getView().addDependent(oDialog);
                                oDialog.open();
                                }.bind(this));                                       
                        } else {
                                this.byId("GLAccount").open();
                        }
                },
                onSearchGLAccountFragment: function () {         // G/L Dialog 에서 검색하는 버튼

                },
                onAcceptGLAccountFragment: function (p) {         // G/L Dialog 에서 선택하는 버튼
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        var path = this.getView().getModel("Product").getProperty(parameter);
                        
                        this.byId("code").setValue(path.code);
                        this.byId("name").setValue(path.name);

                        this.onBackGLAccountFragment();
                },
                onCellClickGLAccountFragment: function (p) {
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        var path = this.getView().getModel("Product").getProperty(parameter);

                        this.byId("code").setValue(path.code);
                        this.byId("name").setValue(path.name);

                        this.onBack();
                },
                onBackGLAccountFragment: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("GLAccount").close();
                },
                
        //AccountGroup Dialog
                onOpenAccountGroup: function () {                  // AccountGroup Dialog open
                        if (!this.byId("AccountGroup")) {
                                Fragment.load({
                                  id: this.getView().getId(),
                                  name: "project2.view.fragment.AccountGroup",
                                  controller: this
                                }).then(function (oDialog) {                          
                                  this.getView().addDependent(oDialog);
                                  oDialog.open();
                                }.bind(this));                                       
                        } else {
                                this.byId("AccountGroup").open();
                        }
                },
                onCellClickAccountGroup: function (p) {
                        console.log(p);
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        console.log(parameter);
                        var path = this.getView().getModel("AccountModel").getProperty(parameter);
                        console.log(path);

                        this.byId("accGroup").setValue(path.accGroup);

                        this.onBackAccountGroupFragment();
                },
                onBackAccountGroupFragment: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("AccountGroup").close();
                },
                onSearchAccountGroupFragment: function() {
                        var search = this.byId("searchAccGrp").getValue();
                        if(search) { 
                        var aFilter = new Filter({                              //Filter는 and가 기본 옵션이다. 3개를 검색하려면 or이기에 and: False로 바꿈
                                filters: [
                                        new Filter("accGroup", FilterOperator.Contains, search),
                                        new Filter("accChart", FilterOperator.Contains, search),
                                        new Filter("accMean", FilterOperator.Contains, search)
                                ],
                                and: false
                        });
                        }
                       
                        var oTable= this.byId("AccGrpTable").getBinding("rows");
                        oTable.filter(aFilter);

                },

        //createCmpCode Dialog
                onCreateCmpCode: function () {
                        if (!this.byId("createCmpCode")) {
                                Fragment.load({
                                  id: this.getView().getId(),
                                  name: "project2.view.fragment.createCmpCode",
                                  controller: this
                                }).then(function (oDialog) {                          
                                  this.getView().addDependent(oDialog);
                                  oDialog.open();
                                }.bind(this));                                       
                        } else {
                                this.byId("createCmpCode").open();
                        }
                },
                onBackcreateCmpCodeFragment: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("createCmpCode").close();
                },
                





        });
});