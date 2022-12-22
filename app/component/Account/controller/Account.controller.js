sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "../model/aFormatter",
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/SearchField',
    'sap/m/Token',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/table/Column',
    'sap/m/Text'
], function (Controller, Filter, FilterOperator, Fragment, Sorter, JSONModel, exportLibrary, Spreadsheet, aFormatter,
    TypeString, ColumnListItem, Label, SearchField, Token, ODataModel, UIColumn, Text) {
    "use strict";
    var groupfilter = [];
    const EdmType = exportLibrary.EdmType;
    var tokenNum;
    var tokenNum1;
    return Controller.extend("project2.controller.Account", {
        formatter: aFormatter,
        onInit: async function () {
            this.getOwnerComponent().getRouter().getRoute("Account").attachPatternMatched(this.onMy, this);

            this._oWhiteSpacesInput1 = this.byId("accChart");
            this._oWhiteSpacesInput2 = this.byId("accGroup");

            var table = this.byId("AccountTable").getBinding("rows");
            console.log(table);

            const countModel = new JSONModel({count: 0});
            this.getView().setModel(countModel, "co");
            if(table != undefined && table.aIndices != undefined){
                this.getView().getModel("co").setProperty("/count", table.aIndices.length)
            }
        },
        onMy: async function () {
            let Account = await $.ajax({
                type: "get",
                url: "/account/GLAcc"
            });

            Account.value.sort(                             // Key 값이 String이라 1/10/~~/2/20 순서로 출력됐는데 1/2/3~으로 출력하기 위한 함수
                function(a, b)  {
                    return Number(a.ID) - Number(b.ID);
                }
            )
            
            let AccountModel = new JSONModel(Account.value);
            this.getView().setModel(AccountModel, "AccountModel");

            let Category = await $.ajax({
                type: "get",
                url: "/account/AccCategory"
            });
            let CategoryModel = new JSONModel(Category.value);
            this.getView().setModel(CategoryModel, "CategoryModel");

            let chart = await $.ajax({
                type: "get",
                url: "/account/COA"
            });
            let chartModel = new JSONModel(chart.value);
            this.getView().setModel(chartModel, "chartModel");

            let group = await $.ajax({
                type: "get",
                url: "/account/Grp"
            });
            let groupModel = new JSONModel(group.value);
            this.getView().setModel(groupModel, "groupModel");

            this.onTableUnitCount();
            this.onReset();

            

            // if(table != undefined && table.aIndices != undefined){
            //     this.getView().getModel("co").setProperty("/count", table.aIndices.length);
            // }
            
        },
        onTableUnitCount: function() {
            var table = this.byId("AccountTable").getBinding("rows");
            console.log(table);
            //console.log(this.getView().getModel("co"));
            const tableRow= table.aIndices.length;
            let countModel = new JSONModel(tableRow.value)
            this.byId("TableName").setText("G/L계정("+tableRow+")");
            this.getView().setModel(countModel, "countModel")
        },
        onSearch: function () {
            let accNumber = this.byId("accNumber").getValue();
            let accChart = this.byId("accChart").getTokens();
            let accCategory = this.byId("accCategory").getSelectedKey();
            let createDate = this.byId("createDate").getValue();
            let accGroup = this.byId("accGroup").getTokens();

            var aFilter = [];

            if (accChart) {
                var value;
                for (var i = 0; i < accChart.length; i++) {
                    value = accChart[i].mProperties.key;
                    aFilter.push(new Filter("accChart", FilterOperator.Contains, value))
                }
            }
            if (accGroup) {
                var value1;
                for (var i = 0; i < accGroup.length; i++) {
                    value1 = accGroup[i].mProperties.key;
                    aFilter.push(new Filter("accGroup", FilterOperator.Contains, value1))
                }
            }

            if (accNumber) { aFilter.push(new Filter("accNumber", FilterOperator.Contains, accNumber)) }
            if (accCategory) { aFilter.push(new Filter("accCategory", FilterOperator.Contains, accCategory)) }
            if (createDate) { aFilter.push(new Filter("createDate", FilterOperator.Contains, createDate)) }
            let oTable = this.byId("AccountTable").getBinding("rows");
            oTable.filter(aFilter);
            this.onTableUnitCount();

        },
        onReset: function () {
            this.byId("accNumber").setValue("");
            this.byId("accChart").removeAllTokens();
            this.byId("accCategory").setSelectedKey("");
            this.byId("createDate").setValue("");
            this.byId("accGroup").removeAllTokens();

            this.onSearch();
            
        },

        //계정과목표 다이얼로그 
        onValueHelpChart1: function () {
            var oCodeTemplate = new Text({ text: { path: 'chartModel>accChart' }, renderWhitespace: true });
            var oTextTemplate = new Text({ text: { path: 'chartModel>accContents' }, renderWhitespace: true });

            if (!this.pWhitespaceDialog1) {
                this.pWhitespaceDialog1 = this.loadFragment({
                    name: "project2.view.fragment.AccountChart"
                });
            }
            this.pWhitespaceDialog1.then(function (oAccChartDialog) {
                var oFilterBar = oAccChartDialog.getFilterBar();
                this.oAccChartDialog = oAccChartDialog;
                if (this._bWhitespaceDialogInitialized) {
                    // Re-set the tokens from the input and update the table
                    oAccChartDialog.setTokens([]);
                    oAccChartDialog.setTokens(this._oWhiteSpacesInput1.getTokens());
                    oAccChartDialog.update();
                    oAccChartDialog.open();
                    return;
                }
                
                //다이얼로그 내 검색창
                this._oBasicSearchField1 = new SearchField({
                    search: function () {
                        this.oAccChartDialog.getFilterBar().search();
                    }.bind(this)
                });

                this.getView().addDependent(oAccChartDialog);

                // Set key fields for filtering in the Define Conditions Tab
                oAccChartDialog.setRangeKeyFields([{
                    label: "계정과목표",
                    key: "accChart"
                }]);

                // Set Basic Search for FilterBar
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchField1);

                // Re-map whitespaces               
                oAccChartDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oModel);

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                        oTable.addColumn(new UIColumn({ label: "계정과목표", template: oCodeTemplate }));
                        oTable.addColumn(new UIColumn({ label: "내역", template: oTextTemplate }));
                        oTable.bindAggregation("rows", {
                            path: "chartModel>/",
                            events: {
                                dataReceived: function () {
                                    oAccChartDialog.update();
                                }
                            }
                        });
                    }
                    oAccChartDialog.update();
                }.bind(this));

                this._bWhitespaceDialogInitialized = true;
                oAccChartDialog.open();
            }.bind(this));
        },
        //확인
        onValueHelpOkPress1: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            console.log(aTokens)

            tokenNum = aTokens.length;    //전역변수
            console.log(tokenNum)

            for (let i = 0; i < tokenNum; i++) {
                aTokens[i].mProperties.text = aTokens[i].mProperties.key;
            }
            this._oWhiteSpacesInput1.setTokens(aTokens)
            this.oAccChartDialog.close();
        },
        //취소
        onValueHelpCancelPress1: function () {
            this.oAccChartDialog.close();
        },
        onFilterBarSearch1: function (oEvent) {
            var sSearchQuery = this._oBasicSearchField1.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");

                console.log(aSelectionSet[0].getValue())
                console.log(aSelectionSet[1])
            
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }
                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "accChart", operator: FilterOperator.Contains, value1: sSearchQuery }),
                    new Filter({ path: "accContents", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));

            this._filterTableAccount(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        _filterTableAccount: function (oFilter) {
            var oValueHelpDialog = this.oAccChartDialog;
            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                oValueHelpDialog.update();
            });
        },


        //계정그룹 다이얼로그
        onValueHelpGroup2: function () {
            var oTextTemplate1 = new Text({ text: { path: 'groupModel>accGroup' }, renderWhitespace: true });
            var oCodeTemplate1 = new Text({ text: { path: 'groupModel>accChart' }, renderWhitespace: true });
            var oTextTemplate2 = new Text({ text: { path: 'groupModel>accMean' }, renderWhitespace: true });
            //계정과목표용 필터 팝업 열릴떄마다 초기화
            /*
            //계정과 목표에 있는 토큰 정보를 기반으로 filter 생성
            if(계정과목표에 값이 있을때){
                for(토큰 갯수만큼 반복문){
                    groupfilter.push //필터
                }
            }
            */
           console.log(this.byId("accChart").getTokens());
            groupfilter = [];
            let chartInput = this.byId("accChart").getTokens();
            var tokenNums = chartInput.length;
            console.log(tokenNums);
            if (tokenNums != 0) {
                var grouptempfilter = [];
                for (var i = 0; i < tokenNums; i++) {
                    var chartText = chartInput[i].mProperties.text;
                    grouptempfilter.push(new Filter("accChart", FilterOperator.Contains, chartText))
                }
                groupfilter.push(new Filter({
                    filters: grouptempfilter,
                    and: false
                }));
            }

            if (!this._oBasicSearchField2) {
                this._oBasicSearchField2 = new SearchField({
                    search: function () {
                        this.oAccGroupDialog.getFilterBar().search();
                    }.bind(this)
                });
            }
        
            if (!this.pWhitespaceDialog2) {
                this.pWhitespaceDialog2 = this.loadFragment({
                    name: "project2.view.fragment.AccountGroup"
                });
            }

            this.pWhitespaceDialog2.then(function (oAccGroupDialog) {
                var oFilterBar2 = oAccGroupDialog.getFilterBar();
                this.oAccGroupDialog = oAccGroupDialog;
                if (this._bWhitespaceDialogInitialized2) {
                    //한번이라도 열렸다면 프래그먼트의 검색 값을 비워주고 필터(계정과 목표의 필터는 적용됨)
                    this._oBasicSearchField2.setValue(null);

                    // Re-set the tokens from the input and update the table
                    oAccGroupDialog.setTokens([]);
                    oAccGroupDialog.setTokens(this._oWhiteSpacesInput2.getTokens());
                    oAccGroupDialog.update();
                    this.onFilterBarSearch2();
                    oAccGroupDialog.open();
                    return;
                }
                this.getView().addDependent(oAccGroupDialog);

                // Set key fields for filtering in the Define Conditions Tab
                oAccGroupDialog.setRangeKeyFields([{
                    label: "계정그룹",
                    key: "accGroup"
                }]);

                // Set Basic Search for FilterBar
                oFilterBar2.setFilterBarExpanded(false);
                oFilterBar2.setBasicSearch(this._oBasicSearchField2);

                oAccGroupDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oModel);

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                        oTable.addColumn(new UIColumn({ label: "계정 그룹", template: oTextTemplate1 }));
                        oTable.addColumn(new UIColumn({ label: "계정과목표", template: oCodeTemplate1 }));
                        oTable.addColumn(new UIColumn({ label: "의미", template: oTextTemplate2 }));
                        oTable.bindAggregation("rows", {
                            path: "groupModel>/",
                            events: {
                                dataReceived: function () {
                                    oAccGroupDialog.update();
                                }
                            }
                        });
                    }

                    oAccGroupDialog.update();
                }.bind(this));
                this._bWhitespaceDialogInitialized2 = true;

                //한번이라도 열리지 않았다면, 계정과 목표의 필터만으로 프래그먼트 필터링
                this._filterTableAccount2(new Filter({
                    filters: groupfilter,
                    and: true
                }));
                oAccGroupDialog.open();
            }.bind(this));
        },

        onValueHelpOkPress2: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            tokenNum1 = aTokens.length;    //전역변수        
            for (let i = 0; i < tokenNum1; i++) {
                aTokens[i].mProperties.text = aTokens[i].mProperties.key;
            }
            this._oWhiteSpacesInput2.setTokens(aTokens);
            this.oAccGroupDialog.close();
            console.log(aTokens);
        },

        onValueHelpCancelPress2: function () {
            this.oAccGroupDialog.close();
        },

        onFilterBarSearch2: function () {
            var sSearchQuery = this._oBasicSearchField2.getValue();
            var aFilters = [];
            //계정과 목표에 값이 있다면 필터 추가
            if (groupfilter.length !== 0) {
                for (var i = 0; i < groupfilter.length; i++) {
                    aFilters.push(groupfilter[i]);
                }
            }
            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "accChart", operator: FilterOperator.Contains, value1: sSearchQuery }),
                    new Filter({ path: "accGroup", operator: FilterOperator.Contains, value1: sSearchQuery }),
                    new Filter({ path: "accMean", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));
            this._filterTableAccount2(new Filter({
                filters: aFilters,
                and: true
            }));
        },
        _filterTableAccount2: function (oFilter) {
            var oValueHelpDialog2 = this.oAccGroupDialog;
            oValueHelpDialog2.getTableAsync().then(function (oTable1) {
                if (oTable1.bindRows) {
                    oTable1.getBinding("rows").filter(oFilter);
                }
                oValueHelpDialog2.update();
            });
        },
        //다이얼로그 컨트롤러 끝


        onCreateAccount: function () {
            let Account = 2;
            this.getOwnerComponent().getRouter().navTo("createAccount", {num: Account});
        },
        onhomeAccount: function () {
            this.getOwnerComponent().getRouter().navTo("homeAccount");
        },
        onDeleteAccount: async function () {
            var totalNumber = this.getView().getModel("AccountModel").oData.length;
            console.log(totalNumber)
            let model = this.getView().getModel("AccountModel");
            let i;
            for (i = 0; i < totalNumber; i++) {
                let chk = '/' + i + '/CHK';
                let key = '/' + i + '/ID';
                if (model.getProperty(chk) === true) {
                    let ID = model.getProperty(key);
                    let url = "/account/GLAcc/" + ID
                    await $.ajax({
                        type: "DELETE",
                        url: url
                    });
                }
           this.onMy(); } 
        },

        onSortAccount: function () {
            console.log("?")
            if (!this.byId("SortDialog")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "project2.view.fragment.SortDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("SortDialog").open();
            }

        },
        onConfirmSortDialog: function (oEvent) {
            //프래그먼트에 있는 버튼
            var oTable = this.byId("AccountTable"),
                mParams = oEvent.getParameters(),
                sPath = mParams.sortItem.getKey(),
                bDescending = mParams.sortDescending,
                aSorters = [];

            aSorters.push(new Sorter(sPath, bDescending));

            let oBinding = oTable.getBinding("rows");
            oBinding.sort(aSorters);
        },

        onDataExport: function () {
            let aCols, oRowBinding, oSettings, oSheet, oTable;

            oTable = this.byId('AccountTable');
            oRowBinding = oTable.getBinding('rows');
            aCols = this.createColumnConfig();

            let oList = [];
            for (let j = 0; j < oRowBinding.oList.length; j++) {
                if (oRowBinding.aIndices.indexOf(j) > -1) {
                    oList.push(oRowBinding.oList[j]);
                }
            }
            console.log(oRowBinding.oList.length);
            for (let i = 0; i < oList.length; i++) {
                if (oList[i].accCategory === 'P') {
                    oList[i].accCategory1 = '1차 원가 또는 수익';
                }
                if (oList[i].accCategory === 'S') {
                    oList[i].accCategory1 = '2차 원가';
                }
                if (oList[i].accCategory === 'N') {
                    oList[i].accCategory1 = '영업 외 비용 또는 수익';
                }
                if (oList[i].accCategory === 'X') {
                    oList[i].accCategory1 = '대차대조표 계정';
                }
                if (oList[i].accCategory === 'C') {
                    oList[i].accCategory1 = '현금 계정';
                }
            }
            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oList,
                fileName: 'AccountTable.xlsx',
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
        createColumnConfig: function () {
            const aCols = [];
            aCols.push({
                label: "G/L계정 번호",
                property: "accNumber",
                type: EdmType.string
            });
            aCols.push({
                label: "계정과목표",
                property: "accChart",
                type: EdmType.string
            });
            aCols.push({
                label: "G/L계정 유형",
                property: "accCategory",
                type: EdmType.int32
            });                     
            aCols.push({
                label: "생성일",
                property: "createDate",
                type: EdmType.string
            });
            aCols.push({
                label: "계정 그룹",
                property: "accGroup",
                type: EdmType.string
            }) 
            return aCols;

        },
        onNavToDetail: function (oEvent) {
            let oControl = oEvent.getSource(),      // navication control
                oParent = oControl.getParent(),     // button control
                oRowControl = oParent.getParent(),  // row control
                oBindingContext = oRowControl.getBindingContext('AccountModel'),  // getBindingContext
                oData = oBindingContext.getObject();    // bindingContext 바인딩되어있는 데이터
            let sId = oData.ID;
            let Account = 2
            this.getOwnerComponent().getRouter().navTo("detailAccount", {num: Account, ID: sId});
        }



    })

});