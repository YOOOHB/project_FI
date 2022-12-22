sap.ui.define([                                 //맨위
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/m/MessageToast'
], function (Controller, Fragment, JSONModel, Filter, FilterOperator, MessageToast) {
        "use strict";        
        let AccNumCount;        //acc num 개수
        let CmpCount;           //회사코드 개수
        let CmpCodeModel;       //회사코드 모델
        let GrpModel;           //계정그룹 모델
        let GLAccModel;         //통합 모델     
        let RouteNum;
        let checkCount = parseInt(0);         //회사코드 검사 

        return Controller.extend("project2.controller.createAccount", {
                onInit: async function(){                        
                        this.getOwnerComponent().getRouter().getRoute("createAccount").attachPatternMatched(this.onRecordNum, this);
                        this.getOwnerComponent().getRouter().getRoute("createAccount").attachPatternMatched(this.onMyRoutePatternMatched, this);
                },
                onMyRoutePatternMatched: async function(url){                        
                        this.onDataCOA(url);
                        this.onDataGrp(url);
                        this.onDataGLAcc(url);  
                        this.onDataCmpCode(url);                      
                        this.onValueReset();

                },
                onRecordNum: function(e) {
                        RouteNum = e.getParameter("arguments").num;
                        console.log(RouteNum)
                },
                onDataCOA: async function(url) {                //계정과목 데이터 가져오기
                        let COA = await $.ajax({
                                type: "get",
                                url: "/account/COA" + url
                        });
                        let COAModel= new JSONModel(COA.value);
                        this.getView().setModel(COAModel, "COAModel");

                },
                onDataGrp: async function(url) {                //계정그룹 데이터 가져오기
                        let Grp = await $.ajax({
                                type: "get",
                                url: "/account/Grp" + url
                        });
                        GrpModel= new JSONModel(Grp.value);
                        this.getView().setModel(GrpModel, "GrpModel");

                },
                onDataGLAcc: async function(url) {              //통합 데이터 가져오기(cmpCode제외)
                        let GLAcc = await $.ajax({
                                type: "get",
                                url: "/account/GLAcc" + url
                        });
                        GLAccModel= new JSONModel(GLAcc.value);
                        AccNumCount = GLAccModel.oData.length+1;        // 전역변수: acc num개수                     
                        this.getView().setModel(GLAccModel, "GLAccModel");

                },
                onDataCmpCode: async function(url) {            //회사코드 데이터 가져오기
                        let CmpCode = await $.ajax({
                                type: "get",
                                url: "/account/CmpCode" + url
                        });
                        CmpCodeModel= new JSONModel(CmpCode.value);
                        CmpCount = CmpCodeModel.oData.length;   //회사코드 개수
                        this.byId("TitleName").setText("회사코드지정("+CmpCount+")"); // 회사코드 테이블 타이틀 회사코드 개수 
                        this.getView().setModel(CmpCodeModel, "CmpCodeModel");

                },
                onValueReset: function() {
                        this.byId("accNumber").setValue("");
                        this.byId("accChart").setSelectedKey("");
                        this.byId("accCategory").setSelectedKey("");
                        this.byId("accGroup").setValue("");
                        this.byId("creator").setValue("");
                        var y = new Date().getFullYear();
                        var m = new Date().getMonth() + 1;
                        var d = new Date().getDate();
                        var currentDate = y + "-" + m + "-" + d;
                        this.byId("createDate").setText(currentDate); 
                        this.getView().byId("CompanyCodeTable").clearSelection();    
                        this.onCheckCmpCode();             
                },

        //createAccount
                onBeforeCreate: function() {                                    //이 함수 실행 후 데이터 로딩까지 시간이 걸릴 수 있음
                        if(checkCount===0) {
                                console.log("nononono")
                        }
                        else {

                                if(!this.byId("accNumber").getValue()) {
                                        MessageToast.show("계정번호를 작성하세요"); 
                                }                               
                                else if(!this.byId("accChart").getSelectedKey()) {
                                        MessageToast.show("계정과목표를 선택하세요");
                                }
                                else if(!this.byId("accCategory").getSelectedKey() || this.byId("accCategory").getSelectedKey()=="전체") {
                                        MessageToast.show("계정유형을 선택하세요");
                                }
                                else if(!this.byId("accGroup").getValue()) {
                                        MessageToast.show("계정그룹을 선택하세요");
                                }
                                else {
                                        this.onCreate();                                        //시간이 걸리면 create로 넘어가기전에 시간 멈추는(?) 함수 실행
                                }
                        }
                },
                onCreate: async function () {                 // createAccount 생성 버튼
                        let selectedCmpCode = this.getView().byId("CompanyCodeTable").getSelectedIndices()[0];  // 회사코드 테이블에서 선택한 열 정보 가져오기
                                                                                                                // 1개밖에 선택 못하니 [0]으로 해도 됨
                        if ( selectedCmpCode == null) {
                                MessageToast.show("회사코드를 선택하세요");
                        }
                        else {                                
                                this.onCreate2(selectedCmpCode);
                        }                        
                },
                onCreate2: async function(selectedCmpCode) {
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

                        this.onDataGLAcc("");   //데이터 새로 불러와서 AccNumCount 초기화

                        let selectCmpCode = selectedCmpCode;

                        var temp={        //GLAcc 
                                ID              : String(AccNumCount),
                                accNumber       : this.byId("accNumber").getValue(),
                                createDate      : this.byId("createDate").getText(),
                                accChart        : this.byId("accChart").getSelectedKey(),
                                accCategory     : this.byId("accCategory").getSelectedKey(),
                                accGroup        : this.byId("accGroup").getValue(),
                                creator         : this.byId("creator").getValue(),
                                accContents     : accContents,
                                cmpCodeKey      : String(selectCmpCode)
                        }
                      
                        await $.ajax({
                                type: "POST",
                                url: "/account/GLAcc",
                                contentType: "application/json;IEEE754Compatible=true", //IEE~ 를 작성하지 않으면 정밀도가 떨어짐
                                data:JSON.stringify(temp)
                        });
                        this.onBack();
                        this.onMyRoutePatternMatched(""); // 데이터 모델 새로 불러오고, valueReset까지
                },
                onBack: function () {                   // createAccount 취소 버튼, 상단 백버튼
                        if (RouteNum=="1"){
                                this.getOwnerComponent().getRouter().navTo("homeAccount");
                        } else if(RouteNum=="2") {
                                this.getOwnerComponent().getRouter().navTo("Account", {name: 1});
                        }
                        this.onValueReset();
                },
                
        //AccountGroup Dialog
                onOpenAccountGroup: async function () {                         //계정그룹 다이얼로그 open 전 계정과목표 필드 조회
                        var accChart = this.byId("accChart").getSelectedKey();
                        if (!accChart) {                                          //계정과목표가 없으면
                                this.onDataGrp("");
                                this.onOpenAccGrp();
                        } else {                                                //있으면 해당하는 계정그룹만 조회
                                let url = "?$filter=accChart eq " + "'" + accChart + "'"
                                this.onDataGrp(url);
                                this.onOpenAccGrp();
                        }                     
                        
                },
                onOpenAccGrp: async function () {                               //계정그룹 다이얼로그 open
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
                onBackAccountGroup: function () {                       // accountGroup2 Dialog 에서 creatAccount로 돌아가는 버튼
                        this.byId("searchAccGrp").setValue("");
                        this.byId("AccountGroup").close();                        
                },
                onSearchAccountGroupFragment: function() {                              //계정과목, 계정그룹, 의미 아무거나 검색해도 다 나옴
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
               
                onCheckCmpCode: async function() {
                        //GLNumModel 가져와서  아래 넘버를 쓰는 CmpCode 가져오기
                        let accChart = this.byId("accChart").getSelectedKey();
                        let GLNum = this.byId("accNumber").getValue();
                        console.log(GLNum)
                        let url = "?$filter=accNumber eq " + "'" + GLNum + "'";
                        console.log(url)
                        this.onDataGLAcc(url);
                        
                        
                        let url2;
                        let CmpCode;
                        if (!GLNum && !accChart) {                                // G/L num이 없고, 계정과목표가 없으면 전체 조회
                                url2 = "";                                
                        } else if(GLNum && !accChart){                            // G/L num이 있고, 계정과목표가 없으면   
                                if(GLAccModel.oData[0]) {
                                        CmpCode = GLAccModel.oData[0].cmpCodeKey;               //위 GLNum이 쓰는 CmpCode              
                                        url2 = "?$filter=cmpCode ne " + "'" + CmpCode + "'";       //GLNum을 쓰는 comCode 제외
                                } else {
                                        url2 = "";                                      //G/L num이 있지만 다른 GL num과 중복되지 않는 경우 
                                }
                        } else if(!GLNum && accChart) {                                   // G/L num이 없고, 계정과목표가 있으면
                                url2= "?$filter=accChart eq " + "'" + accChart + "'";     //해당 계정과목표를 쓰는 회사코드만 조회
                        } else {
                                if(GLAccModel.oData[0]) {
                                        CmpCode = GLAccModel.oData[0].cmpCodeKey;               //위 GLNum이 쓰는 CmpCode
                                        url2= "?$filter=cmpCode ne " + "'" + CmpCode + "'" + " and accChart eq " + "'" + accChart + "'";
                                } else {
                                        url2 = "?$filter=accChart eq " + "'" + accChart + "'";                                      //G/L num이 있지만 다른 GL num과 중복되지 않는 경우 
                                }
                                console.log(url2)
                        }

                        this.onDataCmpCode(url2);
                        checkCount++;
                        
                },
                onCreateCmpCode: function () {                                          //회사코드 생성 다이얼로그 오픈
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
                onAcceptcreateCmpCode: async function () {                             //생성할 회사코드 정보 입력
                        let cmpCode = this.byId("createCmpCodeCmpCode").getValue();
                        let cmpName = this.byId("createCmpCodeCmpName").getValue();
                        let accCurrency = this.byId("createCmpCodeAccCurrency").getValue();
                        let accChart = this.byId("createCmpCodeAccChart").getSelectedKey();

                        this.onDataCmpCode("");

                        for (let i=0; i<CmpCount; i++) {
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
                                this.onBackcreateCmpCode();                                
                        }
                },
                onBackcreateCmpCode: function() {                                       //필드 초기화 + 다이얼로그 닫기
                        this.byId("createCmpCodeCmpCode").setValue("");
                        this.byId("createCmpCodeCmpName").setValue("");
                        this.byId("createCmpCodeAccCurrency").setValue("");
                        this.byId("createCmpCodeAccChart").setSelectedKey("");
                        this.byId("createCmpCode").close();
                        this.onMyRoutePatternMatched("");
                }

        });
});