sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
], function (Controller, Fragment) {
        "use strict";

        return Controller.extend("project2.controller.createAccount", {



        //createAccount
                onCreate: function () {                 // createAccount 생성 버튼

                },
                onBack: function () {                   // createAccount 취소 버튼, 상단 백버튼
                        this.getOwnerComponent().getRouter().navTo("Account");
                },
                
                onSearchAccountGroupFragment: function() {

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

                        this.onBackFragment();
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
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        var path = this.getView().getModel("Product").getProperty(parameter);

                        this.byId("code").setValue(path.code);
                        this.byId("name").setValue(path.name);

                        this.onBack();
                },
                onBackAccountGroupFragment: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("AccountGroup").close();
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