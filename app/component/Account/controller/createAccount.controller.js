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
                onTest: function() {
                        this.getOwnerComponent().getRouter().navTo("Test");
                },
                onMyRoutePatternMatched: async function(){
                        this.onDataCOA();
                        this.onDataGrp();
                        this.onDataGLAcc();
                        this.onDataCmpCode();
                        this.onValueReset();

                },
                onDataCOA: async function() {
                        let COA = await $.ajax({
                                type: "get",
                                url: "/account/COA"
                        });
                        let COAModel= new JSONModel(COA.value);
                        this.getView().setModel(COAModel, "COAModel");

                },
                onDataGrp: async function() {
                        let Grp = await $.ajax({
                                type: "get",
                                url: "/account/Grp"
                        });
                        let GrpModel= new JSONModel(Grp.value);
                        this.getView().setModel(GrpModel, "GrpModel");

                },
                onDataGLAcc: async function() {
                        let GLAcc = await $.ajax({
                                type: "get",
                                url: "/account/GLAcc"
                        });
                        let GLAccModel= new JSONModel(GLAcc.value);
                        this.getView().setModel(GLAccModel, "GLAccModel");

                },
                onDataCmpCode: async function() {
                        let CmpCode = await $.ajax({
                                type: "get",
                                url: "/account/CmpCode"
                        });
                        let CmpCodeModel= new JSONModel(CmpCode.value);
                        this.getView().setModel(CmpCodeModel, "CmpCodeModel");

                },
                onValueReset: function() {
                        this.byId("accNumber").setValue("");
                        this.byId("accChart").setValue("");
                        this.byId("accType").setSelectedItem("");
                        this.byId("accGroup").setValue("");
                        this.byId("creator").setValue("");
                        var y = new Date().getFullYear();
                        var m = new Date().getMonth() + 1;
                        var d = new Date().getDate();
                        var currentDate = y + "-" + m + "-" + d;
                        this.byId("createDate").setText(currentDate);
                        //createCmpCode                        
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
                onSearchGLAccount: function() {

                },
                onAcceptGLAccount: function (p) {         // G/L Dialog 에서 선택하는 버튼
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        var path = this.getView().getModel("Product").getProperty(parameter);
                        
                        this.byId("code").setValue(path.code);
                        this.byId("name").setValue(path.name);

                        this.onBackGLAccount();
                },
                onCellClickGLAccount: function (p) {
                        var parameter = p.mParameters.rowBindingContext.sPath;
                        var path = this.getView().getModel("AccountModel").getProperty(parameter);
                        this.byId("accNumber").setValue(path.accNumber);
                        this.byId("accChart").setValue(path.accChart);
                        this.onBackGLAccount();
                },
                onBackGLAccount: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
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
                        var path = this.getView().getModel("AccountModel").getProperty(parameter);                      
                        this.byId("accGroup").setValue(path.accGroup);
                        this.onBackAccountGroup();
                },
                onBackAccountGroup: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
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
                onAcceptcreateCmpCode: async function () {           // create CompanyCode                                
                        var i=0
                        var temp={
                                accNumber : "i",
                                cmpCode : this.byId("createCmpCodeCmpCode").getValue(),
                                cmpName : this.byId("createCmpCodeCmpName").getValue(),
                                accCurrency : this.byId("createCmpCodeAccCurrency").getValue(),
                                accChart : this.byId("createCmpCodeAccChart").getValue()
                        }
                        i++;
                        console.log(temp)
                      
                        await $.ajax({
                                type: "POST",
                                url: "/account/Account",
                                contentType: "application/json;IEEE754Compatible=true", //IEE~ 를 작성하지 않으면 정밀도가 떨어짐
                                data:JSON.stringify(temp)
                        });

                        this.byId("createCmpCodeCmpCode").setValue("");
                        this.byId("createCmpCodeCmpName").setValue("");
                        this.byId("createCmpCodeAccCurrency").setValue("");
                        this.byId("createCmpCodeAccChart").setValue("");

                        this.byId("createCmpCode").close();
                },
                onBackcreateCmpCode: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("createCmpCode").close();
                }
                





        });
});