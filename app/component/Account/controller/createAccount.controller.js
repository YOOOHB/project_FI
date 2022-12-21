sap.ui.define([                                 //맨위
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/m/MessageToast'
], function (Controller, Fragment, JSONModel, Filter, FilterOperator, MessageToast) {
        "use strict";
        let CmpCodeModel;
        let GLAccModel;
        let GrpModel;
        let GLModel;
        let AccID;
        let Cmp;
        let CmpCount;
        let Gurl;
        let Cmpppppp;
        let num;

        return Controller.extend("project2.controller.createAccount", {
                onInit: async function(){
                        this.getOwnerComponent().getRouter().getRoute("createAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
                        this.getOwnerComponent().getRouter().getRoute("createAccount").attachPatternMatched(this.onRecordNum, this);
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
                onRecordNum: function(e) {
                        num = e.getParameter("arguments").num;
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
                        GrpModel= new JSONModel(Grp.value);
                        this.getView().setModel(GrpModel, "GrpModel");

                },
                onDataGLAcc: async function() {
                        let GLAcc = await $.ajax({
                                type: "get",
                                url: "/account/GLAcc"
                        });
                        GLAccModel= new JSONModel(GLAcc.value);
                        AccID = GLAccModel.oData.length+1;        // 전역변수: acc num개수                     
                        this.getView().setModel(GLAccModel, "GLAccModel");

                },
                onDataCmpCode: async function() {
                        let CmpCode = await $.ajax({
                                type: "get",
                                url: "/account/CmpCode"
                        });
                        CmpCodeModel= new JSONModel(CmpCode.value);
                        CmpCount = CmpCodeModel.oData.length;   //회사코드 개수
                        this.byId("TitleName").setText("회사코드지정("+CmpCount+")"); // 회사코드 테이블 타이틀 회사코드 개수 
                        this.getView().setModel(CmpCodeModel, "CmpCodeModel");

                },
                onValueReset: function() {
                        this.byId("accNumber").setValue("");
                        this.onReset();
                        var y = new Date().getFullYear();
                        var m = new Date().getMonth() + 1;
                        var d = new Date().getDate();
                        var currentDate = y + "-" + m + "-" + d;
                        this.byId("createDate").setText(currentDate);
                        //createCmpCode                        
                },
                onReset: function() {
                        this.byId("accNumber").setSelectedKey("");
                        this.byId("accChart").setSelectedKey("");
                        this.byId("accCategory").setSelectedKey("");
                        this.byId("accGroup").setValue("");
                        this.byId("creator").setValue("");
                        this.onCheckCmpCode();

                },

        //createAccount
                onCreate: async function () {                 // createAccount 생성 버튼
                        if(!this.byId("accNumber").getValue()) {
                                MessageToast.show("계정번호를 작하세요"); 
                        }                               
                        else if(!this.byId("accChart").getSelectedKey()) {
                                MessageToast.show("계정과목표를 선택하세요");
                        }
                        else if(!this.byId("accCategory").getSelectedKey()) {
                                MessageToast.show("계정유형을 선택하세요");
                        }
                        else if(!this.byId("accGroup").getValue()) {
                                MessageToast.show("계정그룹을 선택하세요");
                        }
                        else if (!this.getView().byId("CompanyCodeTable").getSelectedIndices()[0]) {
                                MessageToast.show("회사코드를 선택하세요");
                        }
                        else {
                                this.onCreate1();
                        }                        
                },
                onCreate1: async function() {
                        let model = this.getView().getModel("CmpCodeModel");                    //회사코드 모델 가져오기
                        let CHK = this.getView().byId("CompanyCodeTable").getSelectedIndices()[0];   //회사코드 테이블에서 선택한 열 정보 가져오기
                        Cmp = model.oData[CHK].cmpCode                                      //선택한 회사코드명 

                        let accChart=this.byId("accChart").getSelectedKey();                          //입력한 계정과목표
                        let accContents;                                                        // 에 따른 계정과목표 의미
                        switch (accChart){
                                case "CAJP" :  
                                        accContents = "계정과목표 - 일본"; 
                                        break; 
                                case "CAKR" : 
                                        accContents = "계정과목표 - 한국";
                                        break; 
                                case "YCOA" : 
                                        accContents = "계정과목표 - 표준";
                                        break; 
                                case "YIKR" : 
                                        accContents = "계정과목표 - 독일";
                                        break;                                 
                                default:
                                        break;
                        }                        

                        var temp={        //GLAcc 
                                ID              : String(AccID),
                                accNumber       : this.byId("accNumber").getValue(),
                                createDate      : this.byId("createDate").getText(),
                                accChart        : this.byId("accChart").getSelectedKey(),
                                accCategory     : this.byId("accCategory").getSelectedKey(),
                                accGroup        : this.byId("accGroup").getValue(),
                                creator         : this.byId("creator").getValue(),
                                accContents     : accContents,
                                cmpCodeKey      : Cmp
                        }
                      
                        await $.ajax({
                                type: "POST",
                                url: "/account/GLAcc",
                                contentType: "application/json;IEEE754Compatible=true", //IEE~ 를 작성하지 않으면 정밀도가 떨어짐
                                data:JSON.stringify(temp)
                        });
                        this.onMyRoutePatternMatched(); // input reset 포함
                        this.onBack();
                },
                onBack: function () {                   // createAccount 취소 버튼, 상단 백버튼
                        if (num=="1"){
                                this.getOwnerComponent().getRouter().navTo("homeAccount");
                        } else if(num=="2") {
                                this.getOwnerComponent().getRouter().navTo("Account");
                        }
                },
                
        //AccountGroup Dialog
                onOpenAccountGroup: async function () {         // AccountGroup Dialog open
                        var accCht = this.byId("accChart").getSelectedKey();
                        if (!accCht) {                  //계정과목표가 없으면
                                this.onDataGrp();
                                this.onOpenAccGrp();
                        } else {
                                let Grp = await $.ajax({
                                        type: "get",
                                        url: "/account/Grp?$filter=accChart eq " + "'" + accCht + "'"                                        
                                });
                                GrpModel= new JSONModel(Grp.value);
                                this.getView().setModel(GrpModel, "GrpModel");
                                this.onOpenAccGrp();
                        }                     
                        
                },
                onOpenAccGrp: async function () {
                        if (!this.byId("AccountGroup")) {
                                Fragment.load({
                                  id: this.getView().getId(),
                                  name: "project2.view.fragment.AccountGroup2",
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

                        var path = this.getView().getModel("GrpModel").getProperty(parameter);                      
                        this.byId("accGroup").setValue(path.accGroup);
                        this.byId("accChart").setSelectedKey(path.accChart);
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
                                        new Filter("accChart", FilterOperator.Contains, search),
                                        new Filter("accGroup", FilterOperator.Contains, search),
                                        new Filter("accMean", FilterOperator.Contains, search)
                                ],
                                and: false
                        });
                        }
                       
                        var oTable= this.byId("AccountGroupTable").getBinding("rows");
                        oTable.filter(aFilter);

                },

        //createCmpCode Dialog
                onCheckCmpCode: async function() {                              // G/L num이 중복되는 cmpCode 제외
                        //GLNumModel 가져와서  아래 넘버를 쓰는 CmpCode 가져오기
                        let GLNum = this.byId("accNumber").getValue();
                        let urll = "?$filter=accNumber eq " + "'" + GLNum + "'";
                        let GLAcc = await $.ajax({
                                type: "get",
                                url: "/account/GLAcc" + urll                 
                        });
                        GLModel= new JSONModel(GLAcc.value);
                        
                        if(this.byId("accNumber").getValue()){
                                Cmpppppp = GLModel.oData[0].cmpCodeKey;               //위 GLNum이 쓰는 CmpCode
                        }
                        let accCht = this.byId("accChart").getSelectedKey();
                        if (!GLNum && !accCht) {                                // G/L num이 없고, 계정과목표가 없으면 전체 조회
                                Gurl = "";                                
                        } else if(GLNum && !accCht){                            // G/L num이 있고, 계정과목표가 없으면                               
                                Gurl= "?$filter=cmpCode ne " + "'" + Cmpppppp + "'";       //GLNum을 쓰는 comCode 제외
                        } else if(!GLNum && accCht) {                            // G/L num이 없고, 계정과목표가 있으면                                 
                                Gurl= "?$filter=accChart eq " + "'" + accCht + "'";
                        } else {
                                Gurl= "?$filter=cmpCode ne " + "'" + Cmpppppp + "'" + " and accChart eq " + "'" + accCht + "'";                                
                        }
                        this.onCheckCmpCode2();
                },
                onCheckCmpCode2: async function() {                             // 전체 CmpCode 조회
                        let Cmppp = await $.ajax({
                                type: "get",
                                url: "/account/CmpCode" + Gurl                                           
                        });
                        CmpCodeModel= new JSONModel(Cmppp.value);
                        CmpCount = CmpCodeModel.oData.length;   //회사코드 개수
                        this.byId("TitleName").setText("회사코드지정("+CmpCount+")"); // 회사코드 테이블 타이틀 회사코드 개수                         
                        this.getView().setModel(CmpCodeModel, "CmpCodeModel");                         
                },        
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
                        let cmpCode = this.byId("createCmpCodeCmpCode").getValue();
                        let cmpName = this.byId("createCmpCodeCmpName").getValue();
                        let accCurrency = this.byId("createCmpCodeAccCurrency").getValue();
                        let accChart = this.byId("createCmpCodeAccChart").getSelectedKey();

                        let cmpCount=CmpCodeModel.oData.length;
                        for (let i=0; i<cmpCount; i++) {
                                if(CmpCodeModel.oData[i].cmpCode === cmpCode){
                                        MessageToast.show("중복된 회사코드입니다");
                                        continue
                                }
                        }

                        if(!cmpCode) {
                                MessageToast.show("회사코드를 입력하세요")
                        }
                        else if(!cmpName) {
                                MessageToast.show("회사이름을 입력하세요")
                        }
                        else if(!accCurrency) {
                                MessageToast.show("계정통화를 입력하세요")
                        }
                        else if(!accChart){
                                MessageToast.show("계정과목표를 선택하세요")
                        }
                        else {
                                var temp={
                                        cmpCode : cmpCode,
                                        cmpName : cmpName,
                                        accCurrency : accCurrency,
                                        accChart : accChart
                                }
                        
                                await $.ajax({
                                        type: "POST",
                                        url: "/account/CmpCode",
                                        contentType: "application/json;IEEE754Compatible=true", //IEE~ 를 작성하지 않으면 정밀도가 떨어짐
                                        data:JSON.stringify(temp)
                                });
                                

                                this.byId("createCmpCodeCmpCode").setValue("");
                                this.byId("createCmpCodeCmpName").setValue("");
                                this.byId("createCmpCodeAccCurrency").setValue("");
                                this.byId("createCmpCodeAccChart").setSelectedKey("");
                                this.byId("createCmpCode").close();
                                this.onMyRoutePatternMatched();
                        }
                },
                onBackcreateCmpCode: function () {           // Dialog 에서 creatAccount로 돌아가는 버튼 공통
                        this.byId("createCmpCode").close();
                }
                





        });
});