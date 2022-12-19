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

            this._oWhiteSpacesInput = this.byId("accChart");
            this._oWhiteSpacesInput1 = this.byId("accGroup");
        },
        onMy: async function () {
            let Account = await $.ajax({
                type: "get",
                url: "/account/GLAcc"
            });
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

            this._oBasicSearchField = new SearchField({
                search: function () {
                    this.oAccChartDialog.getFilterBar().search();
                }.bind(this)
            });
            if (!this.pWhitespaceDialog) {
                this.pWhitespaceDialog = this.loadFragment({
                    name: "project2.view.fragment.AccountChart"
                });
            }
            this.pWhitespaceDialog.then(function (oAccChartDialog) {
                var oFilterBar = oAccChartDialog.getFilterBar();
                this.oAccChartDialog = oAccChartDialog;
                if (this._bWhitespaceDialogInitialized) {
                    // Re-set the tokens from the input and update the table
                    oAccChartDialog.setTokens([]);
                    oAccChartDialog.setTokens(this._oWhiteSpacesInput.getTokens());
                    oAccChartDialog.update();
                    oAccChartDialog.open();
                    return;
                }
                this.getView().addDependent(oAccChartDialog);

                // Set key fields for filtering in the Define Conditions Tab
                oAccChartDialog.setRangeKeyFields([{
                    label: "계정과목표",
                    key: "accChart"
                }]);

                // Set Basic Search for FilterBar
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchField);

                // Re-map whitespaces
                // oFilterBar.determineFilterItemByName("ProductCode").getControl().setTextFormatter(this._inputTextFormatter);

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

                // oAccChartDialog.setTok/ens(t/his._oWhiteSpacesInput.getTokens());
                this._bWhitespaceDialogInitialized = true;
                oAccChartDialog.open();
            }.bind(this));
        },

        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            console.log(aTokens)

            tokenNum = aTokens.length;    //전역변수
            console.log(tokenNum)

            for (let i = 0; i < tokenNum; i++) {
                aTokens[i].mProperties.text = aTokens[i].mProperties.key;
            }


            this._oWhiteSpacesInput.setTokens(aTokens)
            this.oAccChartDialog.close();

        },

        onValueHelpCancelPress: function () {
            this.oAccChartDialog.close();
        },

        onFilterBarSearch: function (oEvent) {
            var sSearchQuery = this._oBasicSearchField.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");

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
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oValueHelpDialog.update();
            });
        },

        //계정그룹 다이얼로그

        onValueHelpGroup2: function () {
            var oCodeTemplate1 = new Text({ text: { path: 'groupModel>accChart' }, renderWhitespace: true });
            var oTextTemplate1 = new Text({ text: { path: 'groupModel>accGroup' }, renderWhitespace: true });
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
            groupfilter = [];
            let chartInput= this.byId("accChart").getTokens()
            var tokenNums;
            console.log(chartInput[0].mProperties.text);
            tokenNums=chartInput.length;
            console.log(tokenNums);
            var chartText;
            if(chartInput != null){
                for (var i=0; i<tokenNums;i++){
                    chartText = chartInput[i].mProperties.text;
                    groupfilter.push(new Filter("accChart", FilterOperator.Contains, chartText))
                }
            }
            
      
            console.log(groupfilter);
            console.log(groupfilter[0].oValue1);
            // groupfilter




            if (!this._oBasicSearchField1) {
                this._oBasicSearchField1 = new SearchField({
                    search: function () {
                        this.oAccGroupDialog.getFilterBar().search();
                    }.bind(this)
                });
            }
            else {
                //console.log(this._oBasicSearchField1);
            }
            if (!this.pWhitespaceDialog1) {
                this.pWhitespaceDialog1 = this.loadFragment({
                    name: "project2.view.fragment.AccountGroup"
                });
            }

            this.pWhitespaceDialog1.then(function (oAccGroupDialog) {
                var oFilterBar1 = oAccGroupDialog.getFilterBar();
                this.oAccGroupDialog = oAccGroupDialog;
                if (this._bWhitespaceDialogInitialized2) {
                    //한번이라도 열렸다면 프래그먼트의 검색 값을 비워주고 필터(계정과 목표의 필터는 적용됨)
                    this._oBasicSearchField1.setValue(null);
                    this.onFilterBarSearch2();
                    // Re-set the tokens from the input and update the table

                    oAccGroupDialog.setTokens([]);
                    oAccGroupDialog.setTokens(this._oWhiteSpacesInput1.getTokens());
                    oAccGroupDialog.update();
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
                oFilterBar1.setFilterBarExpanded(false);
                oFilterBar1.setBasicSearch(this._oBasicSearchField1);


                // Re-map whitespaces
                // oFilterBar.determineFilterItemByName("ProductCode").getControl().setTextFormatter(this._inputTextFormatter);

                oAccGroupDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oModel);

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                        oTable.addColumn(new UIColumn({ label: "계정과목표", template: oCodeTemplate1 }));
                        oTable.addColumn(new UIColumn({ label: "계정 그룹", template: oTextTemplate1 }));
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

                // oAccGroupDialog.setTok/ens(t/his._oWhiteSpacesInput1.getTokens());
                this._bWhitespaceDialogInitialized2 = true;



                //한번이라도 열리지 않았다면, 계정과 목표의 필터만으로 프래그먼트 필터링
                this._filterTableAccount1(new Filter({
                    filters: groupfilter,
                    and: true
                }));
                //
                oAccGroupDialog.open();
            }.bind(this));
        },

        onValueHelpOkPress2: function (oEvent) {
            var aTokens1 = oEvent.getParameter("tokens");
            console.log(aTokens1)

            tokenNum1 = aTokens1.length;    //전역변수
            console.log(tokenNum1)
            var arr = [];
            for (let i = 0; i < tokenNum1; i++) {
                aTokens1[i].mProperties.text = aTokens1[i].mProperties.key;
                //arr.push(aTokens1[i].mProperties.text)
            }
            console.log(arr);

            this._oWhiteSpacesInput1.setTokens(aTokens1);
            this.oAccGroupDialog.close();


        },

        onValueHelpCancelPress2: function () {
            this.oAccGroupDialog.close();

        },

        onFilterBarSearch2: function () {
            var sSearchQuery = this._oBasicSearchField1.getValue();
            var aFilters = [];
            //계정과 목표에 값이 있다면 필터 추가
            if (groupfilter.length !== 0) {
                aFilters.push(groupfilter);
            }
            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "accChart", operator: FilterOperator.Contains, value1: sSearchQuery }),
                    new Filter({ path: "accGroup", operator: FilterOperator.Contains, value1: sSearchQuery }),
                    new Filter({ path: "accMean", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));

            this._filterTableAccount1(new Filter({
                filters: aFilters,
                and: true
            }));
        },


        _filterTableAccount1: function (oFilter) {
            var oValueHelpDialog1 = this.oAccGroupDialog;
            oValueHelpDialog1.getTableAsync().then(function (oTable1) {
                if (oTable1.bindRows) {
                    oTable1.getBinding("rows").filter(oFilter);
                }
                if (oTable1.bindItems) {
                    oTable1.getBinding("items").filter(oFilter);
                }
                oValueHelpDialog1.update();
            });
        },
        //다이얼로그 컨트롤러 끝



        onCreateAccount: function () {
            this.getOwnerComponent().getRouter().navTo("createAccount");
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
                let key = '/' + i + '/accNumber';
                if (model.getProperty(chk) === true) {
                    let accNumber = model.getProperty(key);
                    let url = "/account/GLAcc/" + accNumber
                    await $.ajax({
                        type: "DELETE",
                        url: url
                    });
                }
            } this.onMy();
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
            for (let i = 0; i < oList.length; i++) {
                if (oList[i].accCategory === 'P') {
                    oList[i].accCategory = '1차 원가 또는 수익';
                }
                if (oList[i].accCategory === 'S') {
                    oList[i].accCategory = '2차 원가';
                }
                if (oList[i].accCategory === 'N') {
                    oList[i].accCategory = '영업 외 비용 또는 수익';
                }
                if (oList[i].accCategory === 'X') {
                    oList[i].accCategory = '대차대조표 계정';
                }
                if (oList[i].accCategory === 'C') {
                    oList[i].accCategory = '현금 계정';
                }
            }
            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oRowBinding,
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
                label: "계정 그룹",
                property: "accGroup",
                type: EdmType.string
            });
            aCols.push({
                label: "생성일자",
                property: "createDate",
                type: EdmType.string
            });
            return aCols;

        },
        onNavToDetail: function (e) {
            console.log(e.getParameter())
            console.log(e.getSource())
            this.getOwnerComponent().getRouter().navTo("detailAccount");

        }



    })

});