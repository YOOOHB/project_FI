sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "../model/aFormatter"
],function (Controller, Filter, FilterOperator, Fragment, Sorter, JSONModel, exportLibrary, Spreadsheet, aFormatter){
    "use strict";
    Formatter: aFormatter;
    const EdmType = exportLibrary.EdmType;
    return Controller.extend("project2.controller.Account",{
        formatter:formatter,
        onInit: async function(){
            this.getOwnerComponent().getRouter().getRoute("Account").attachPatternMatched(this.onMy, this);           
            
        
        },
    onMy: async function(){
        let Account = await $.ajax({
            type:"get",
            url:"/account/Account"
        });
        let AccountModel= new JSONModel(Account.value);
        this.getView().setModel(AccountModel,"AccountModel");

        // let category = await $.ajax({
        //     type:"get",
        //     url:"/Account/AccCategory"
        // });
        // let categoryModel = new JSONModel(category,value);
        // this.getView().setModel(categoryModel,"categoryModel")
        
    },
    onSearch:function(){
        let accNumber=this.byId("accNumber").getValue();
        let accChart=this.byId("accChart").getValue();
        let accCategory=this.byId("accCategory").getValue();
        let createDate=this.byId("createDate").getValue();
        let accGroup=this.byId("accGroup").getValue();
        
        if(createDate){
            let accYear= createDate.split(". ")[0];
            let accMonth= createDate.split(". ")[1].padStart(2,'0');
            let accday= createDate.split(". ")[2].padStart(2,'0');
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
        this.byId("accCategory").setSelectedKey("");
        this.byId("accGroup").setValue("");
        this.byId("createDate").setValue("");

        this.onSearch();
    },
    onValueHelpChart : function () {
        if (!this.pValueHelpDialog) {
            this.pValueHelpDialog = this.loadFragment({
              name: "project2.view.fragment.AccountChart"
            });
        }
        this.pValueHelpDialog.then(function(oDialog){
             oDialog.open();
        });
   
    },
    onCloseDialog1 : function(){
        this.byId("chartpop").close();
        this.pValueHelpDialog
    },
    onCreateAccount: function(){
        this.getOwnerComponent().getRouter().navTo("createAccount");      
    },
    onhomeAccount: function(){
        this.getOwnerComponent().getRouter().navTo("homeAccount");      
    },
    onDeleteAccount :async function(){
        var totalNumber=this.getView().getModel("AccountModel").oData.length;
        let model= this.getView().getModel("AccountModel");
        let i;
        for(i=0;i<totalNumber;i++){
            let chk= '/'+i+'/CHK';
            let key='/'+i+'accNumber';
            if (model.getProperty(chk)===true){
                let accNumber=model.getProperty(key);
                let url =  "/Account/Acoount/"+accNumber
                await $.ajax({
                    type:"DELETE",
                    url:url
                });
            }
        }this.onMy();

    }
    ,
    onSortAccount: function(){
        if (!this.byId("SortDialog")){
            Fragment.load({
                id:this.getView().getId(),
                name:"project2.view.fragment.SortDialog",
                Controller:this
            }),then(function(oDialog){
                this.getView().addDependent(oDialog);
                oDialog.open();
            })
        }else{
            this.byId("SortDialog").open();
        }
        this.onSearch();
    },
    onConfirmSortDialog: function(oEvent){
        let mParams= oEvent.getParameters();
        let sPath=mParams.sortItem.getKey();
        let bDescending=mParams.sortDescending;
        let aSorters=[];

        aSorters.push(new Sorter(sPath.bDescending));

        let oBinding= this.byId("AccountTable").getBinding("rows");
        oBinding.sort(aSorters);
    },
    
    onDataExport: function(){
        let aCols, oRowBindig, oSettings, oSheet, oTable;
        oTable=this.byId("AccountTable");
        oRowBindig=oTable.getBinding('rows');
        aCols= this.createColumnConfig();
        let oList=[];
        for (let j=0; j<oRowBindig.oList.length; j++){
            if (oRowBindig.aIndices.indexOf(j)>-1){
                oList.push(oRowBindig.oList[j]);
            }
        }

        oSettings= {
            workbook:{
                hierarchyLevel:'Level'
            },
            dataSource:oRowBindig,
            fileName:'AccountTable.xlsx',
            worker: false
        };
        oSheet=new Spreadsheet(oSettings);
        oSheet.build().finally(function(){
            oSheet.destroy();
        });
        
    },
    createColumnConfig : function(){
        const aCols=[];
        aCols.push({
            label:"G/L계정 번호",
            property:"accNumber",
            type:EdmType.string
        });
        aCols.push({
            label:"계정과목표",
            property:"accChart",
            type:EdmType.string
        });
        aCols.push({
            label:"G/L계정 유형",
            property:"accCategory",
            type:EdmType.int32
        });
        aCols.push({
            label:"계정 그룹",
            property:"accGroup",
            type:EdmType.string
        });
        aCols.push({
            label:"생성일자",
            property:"createDate",
            type:EdmType.string
        });
        return aCols;

    }, 
    onNavToDetail: function(){
        this.getOwnerComponent().getRouter().navTo("detailAccount");
    }

    })
    
});