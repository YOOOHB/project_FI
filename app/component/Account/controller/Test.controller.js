sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/comp/library',
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/SearchField',
    'sap/m/Token',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/table/Column',
    'sap/m/Column',
    'sap/m/Text'
], function (Controller, JSONModel, compLibrary, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
    "use strict";
    let GrpModel;
    var accGroup
    return Controller.extend("project2.controller.Test", {
        onInit: async function () {
            this.getOwnerComponent().getRouter().getRoute("Test").attachPatternMatched(this.onMyRoutePatternMatched, this);

            // Value Help Dialog standard use case with filter bar without filter suggestions
            this._oMultiInput = this.byId("multiInput");          
        },

        onMyRoutePatternMatched: async function () {
            this.onDataCOA();
            this.onDataGrp();
            this.onDataGLAcc();
            this.onDataCmpCode();
            this.onDataAccCategory();

        },

        onExit: function () {
            if (this.GrpModel) {
                this.GrpModel.destroy();
                this.GrpModel = null;
            }
        },



        // #region Value Help Dialog standard use case with filter bar without filter suggestions
        onOpenAccountGroupDialog: function () {
            this._oBasicSearchField = new SearchField();
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "project2.view.fragment.AccountGroup"
                });
            }
            this.pDialog.then(function (oDialog) {
                var oFilterBar = oDialog.getFilterBar();
                this._oVHD = oDialog;
                // Initialise the dialog with model only the first time. Then only open it
                if (this._bDialogInitialized) {
                    // Re-set the tokens from the input and update the table
                    oDialog.setTokens([]);
                    oDialog.setTokens(this._oMultiInput.getTokens());
                    oDialog.update();

                    oDialog.open();
                    return;
                }
                this.getView().addDependent(oDialog);

                // Set key fields for filtering in the Define Conditions Tab
                oDialog.setRangeKeyFields([{
                    label: "계정그룹",
                    key: accGroup
                }]);

                // Set Basic Search for FilterBar
                oFilterBar.setFilterBarExpanded(false);
                // 나만쓰는 함수에요 
                // private
                oFilterBar.setBasicSearch(this._oBasicSearchField);

                // Trigger filter bar search when the basic search is fired
                this._oBasicSearchField.attachSearch(function () {
                    oFilterBar.search();
                });

                oDialog.getTableAsync().then(function (oTable) {

                    oTable.setModel(this.oProductsModel);

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                        // Bind rows to the ODataModel and add columns
                        oTable.bindAggregation("rows", {
                            path: "GrpModel>/",
                            events: {
                                dataReceived: function () {
                                    oDialog.update();
                                }
                            }
                        });
                        oTable.addColumn(
                            new UIColumn(
                                {
                                    label: "계정과목표",
                                    template: new Text({
                                        text: "{GrpModel>accChart}"
                                    })
                                }                                
                            )
                        );
                        oTable.addColumn(
                            new UIColumn(
                                { 
                                    label: "계정그룹",
                                    template: new Text({
                                        text: "{GrpModel>accGroup}"
                                    })
                                    
                                }
                            )
                        );
                        oTable.addColumn(
                            new UIColumn(
                                {
                                    label: "의미",
                                    template: new Text({
                                        text: "{GrpModel>accMean}"
                                    })                            
                                }
                            )
                        )
                    }            
                    oDialog.update();
                }.bind(this));

                oDialog.setTokens(this._oMultiInput.getTokens());

                // set flag that the dialog is initialized
                this._bDialogInitialized = true;
                oDialog.open();
            }.bind(this));
        },

        onValueHelpOkPress2: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            accGroup = aTokens[0].mAggregations.customData[0].mProperties.value.accGroup;
            console.log(accGroup)
            this._oMultiInput.getTokens(aTokens);
            this._oVHD.close();
        },

        onValueHelpCancelPress2: function () {
            this._oVHD.close();
        },



























        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("createAccount");
        },
        onDataCOA: async function () {
            let COA = await $.ajax({
                type: "get",
                url: "/account/COA"
            });
            let COAModel = new JSONModel(COA.value);
            this.getView().setModel(COAModel, "COAModel");

        },
        onDataGrp: async function () {
            let Grp = await $.ajax({
                type: "get",
                url: "/account/Grp"
            });
            GrpModel = new JSONModel(Grp.value);
            this.getView().setModel(GrpModel, "GrpModel");

        },
        onDataGLAcc: async function () {
            let GLAcc = await $.ajax({
                type: "get",
                url: "/account/GLAcc"
            });
            let GLAccModel = new JSONModel(GLAcc.value);
            this.getView().setModel(GLAccModel, "GLAccModel");

        },
        onDataCmpCode: async function () {
            let CmpCode = await $.ajax({
                type: "get",
                url: "/account/CmpCode"
            });
            let CmpCodeModel = new JSONModel(CmpCode.value);
            this.getView().setModel(CmpCodeModel, "CmpCodeModel");

        },
        onDataAccCategory: async function () {
            let AccCategory = await $.ajax({
                type: "get",
                url: "/account/AccCategory"
            });
            let AccCategoryModel = new JSONModel(AccCategory.value);
            this.getView().setModel(AccCategoryModel, "AccCategoryModel");

        }





    });
});