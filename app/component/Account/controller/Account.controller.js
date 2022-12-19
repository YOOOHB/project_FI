sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet"
],function (Controller, Filter, FilterOperator, Fragment, Sorter, JSONModel,exportLibrary,Spreadsheet){
    "use strict";
    const EdmType = exportLibrary.EdmType;
    return Controller.extend("project2.controller.Account",{
        formatter:formatter,
        onInit: async function(){
            this.getOwnerComponent().getRouter().getRoute("Account").attachPatternMatched(this.onMy, this);           
            
        
        },
    onMy: async function(){
        Account = await $.ajax({
            type:"get",
            url:"/account/Account"
        });
        let AccountModel= new JSONModel(Account.value);
<<<<<<< HEAD
        this.getView.setModel(AccountModel,"AccountModel");
=======
        this.getView().setModel(AccountModel,"AccountModel");

        // let category = await $.ajax({
        let accNumber=this.byId("accNumber").getValue();
        let accChart=this.byId("accChart").getValue();
        let accCategory=this.byId("accCategory").getValue();
        
        if(createDate){
            let accYear= create.split(".")[0];
            let accday= create.split(".")[2];padStart(2,'0');
            createDate= accYear+"-"+accMonth+"-"+accday;
        }
        var aFilter=[];
        if(accNumber){aFilter.push(new Filter("accNumber", FilterOperator.Contains, accNumber))}
        if(accChart){aFilter.push(new Filter("accChart", FilterOperator.Contains, accChart))}
        if(accCategory){aFilter.push(new Filter("accCategory", FilterOperator.Contains, accCategory))}
        if(accGroup){aFilter.push(new Filter("accGroup", FilterOperator.Contains, accGroup))}
        if(createDate){aFilter.push(new Filter("createDate", FilterOperator.Contains, createDate))}
        let oTable=this.byId("AccountTable").getBinding("rows");
        oTable.filter(aFilter);

    },
    onReset: function(){
        this.byId("accNumber").setValue("");
        this.byId("accChart").setValue("");
<<<<<<< HEAD
        this.byId("accCategory").setValue("");
        this.byId("accGroup").setValue("");
        this.byId("createDate").setSelectedKey("");
=======
        this.byId("accCategory").setSelectedKey("");
        this.byId("accGroup").setValue("");
        this.byId("createDate").setValue("");
>>>>>>> 7026ea797787d7cf1a272ef860a91dee02e2093e

        this.onSearch
    },
    onValueHelpChart : function () {
        if (!this.pValueHelpDialog) {
            this.pValueHelpDialog = this.loadFragment({
              name: "project2.view.fragment.AccountChart"
            });
        }
