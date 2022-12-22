sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "../model/Cformatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/SearchField",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Text",

  ],
  function (Controller, Cformatter, JSONModel, SearchField, Fragment, Sorter, Filter, FilterOperator, Spreadsheet, exportLibrary, ColumnListItem, Label, UIColumn, MColumn, Text) {
    "use strict";

    let totalNumber;
    const EdmType = exportLibrary.EdmType;
    var tokenNum;

    return Controller.extend("project3.controller.Customer", {
      Cformatter: Cformatter,

      // // 프로그램 처음 실행할때 딱한번만 실행되는 함수.
      // onInit: async function () {
      //   // this -> Controller

      // //처음 모델을 세팅하는 함수. 
      // _initModel: function () {

      //   //jsonModel - two-Binding - view <-> model 실시간 연동

      //   this.getView()
      //     .setModel(
      //       new JSONModel({}),
      //       'search'
      //     )
      // },

      // 프로그램 처음 실행할때 딱한번만 실행되는 함수
      onInit: async function () {
        this.getOwnerComponent().getRouter().getRoute("Customer").attachPatternMatched(this.onMyRoutePatternMatched, this);

        this._oWhiteSpacesInput = this.byId("cmpCode");
      },

      //모델 선언
      onMyRoutePatternMatched: async function () {
        let Customer = await $.ajax({
          type: "get",
          url: "/customer/Customer"
        });
        let CustomerModel = new JSONModel(Customer.value);
        this.getView().setModel(CustomerModel, "CustomerModel");

        let cmpCode = await $.ajax({
          type: "get",
          url: "/customer/cmpCode"
        });
        let CompanyCodeModel = new JSONModel(cmpCode.value);
        this.getView().setModel(CompanyCodeModel, "CompanyCodeModel");

        this.onTableUnitCount();

        this.onClearField();

        // let bpRange = await $.ajax({
        //   type: "get",
        //   url: "/customer/bpRange"
        // });
        // let bpRangeModel = new JSONModel(bpRange.value);
        // this.getView().setModel(bpRangeModel, "bpRangeModel");
      },

      //테이블 컬럼 수 표시
      onTableUnitCount: function () {
        var table = this.byId("CustomerTable").getBinding("rows");
        const tableRow = table.aIndices.length;
        let countModel = new JSONModel(tableRow.value)
        this.byId("CustomerList").setText("고객 목록(" + tableRow + ")");
        this.getView().setModel(countModel, "countModel")
      },

      //뒤로 가기 기능
      onBack: function () {
        this.getOwnerComponent().getRouter().navTo("homeCustomer");
      },


      // onSearch: function () {
      //   /**
      //    * s - string
      //    * o - object
      //    * a - array
      //    * i - number
      //    * b - boolean
      //    */

      //   let oView = this.getView(),
      //     oFilterBar = oView.byId('filterbar'),
      //     aFilterGroupItems = oFilterBar.getFilterGroupItems();

      //   let aTableFilters = [];
      //   aFilterGroupItems.forEach(function (oFilterItem) {
      //     let oControl = oFilterItem.getControl();

      //     let sBindingKey;
      //     switch (oControl.getMetadata().getName()) {
      //       case "sap.m.Input":
      //         sBindingKey = oControl.getValue()
      //         break;

      //       case "sap.m.DatePicker":
      //         sBindingKey = oControl.getValue()
      //         break;

      //       case "sap.m.Select":
      //         sBindingKey = oControl.getSelectedItem().getText()
      //         break;

      //       case "sap.m.MultiInput":
      //           sBindingKey = 'Multi';
      //           break;

      //       default:
      //         break;
      //     }

      //     if (sBindingKey === '전체') {
      //       return;
      //     }

      //     if(sBindingKey === 'Multi') {
      //       oControl.getTokens()
      //               .forEach(function(oToken) {
      //                   aTableFilters.push(
      //                       new Filter(
      //                           oFilterItem.getName(),
      //                           'EQ',
      //                           oToken.getKey()
      //                       )
      //                   )
      //               });
      //     }

      //     if (sBindingKey) {
      //       aTableFilters.push(
      //         new Filter(
      //           oFilterItem.getName(),
      //           'EQ',
      //           sBindingKey
      //         )
      //       );
      //     }
      //   });

      //   this.byId('CustomerTable').getBinding("rows").filter(aTableFilters);
      // },

      //검색 기능
      onSearch: function () {
        var name = this.byId("name").getValue();
        var customerNumber = this.byId("customerNumber").getValue();
        var cmpCode = this.byId("cmpCode").getValue();
        var createDate = this.byId("createDate").getValue();
        var country = this.byId("country").getValue();
        var bpRange = (this.byId("bpRange").getSelectedKey());

        var aFilter = [];
        if (cmpCode) {
          var cmp = [];
          var cmpcd = [];
          for (var i = 0; i < tokenNum; i++) {
            cmp.push(cmpCode.split(",")[i])
            cmpcd.push(new Filter("cmpCode", FilterOperator.Contains, cmp[i]));
          }
          aFilter.push(new Filter({
            filters: cmpcd,
            and: false
          }));

        }

        // if (createDate) {
        //   let cusYear = createDate.split(". ")[0];
        //   let cusMonth = createDate.split(". ")[1].padStart(2, '0');
        //   let cusday = createDate.split(". ")[2].padStart(2, '0');
        //   createDate = cusYear + "-" + cusMonth + "-" + cusday;
        // }

        if (name) { aFilter.push(new Filter("name", FilterOperator.Contains, name)) }
        if (customerNumber) { aFilter.push(new Filter("customerNumber", FilterOperator.EQ, customerNumber)) }
        if (createDate) { aFilter.push(new Filter("createDate", FilterOperator.Contains, createDate)) }
        if (country) { aFilter.push(new Filter("country", FilterOperator.Contains, country)) }
        if (bpRange) { aFilter.push(new Filter("bpRange", FilterOperator.Contains, bpRange)) }
        let oTable = this.byId("CustomerTable").getBinding("rows");
        oTable.filter(aFilter);

        this.onTableUnitCount()
      },

      //초기화 기능
      onReset: function () {
        this.byId("name").setValue("");
        this.byId("customerNumber").setValue("");
        this.byId("cmpCode").setValue("");
        this.byId("createDate").setValue("");
        this.byId("country").setValue("");
        this.byId("bpRange").setSelectedKey("");

        this.onSearch();
      },

      //회사 코드 검색 다이얼로그
      onValueHelpRequest: function () {
        var oCodeTemplate = new Text({ text: { path: 'CompanyCodeModel>cmpCode_key' }, renderWhitespace: true });
        var oTextTemplate = new Text({ text: { path: 'CompanyCodeModel>cmpCode_kor' }, renderWhitespace: true });

        if (!this.pWhitespaceDialog) {
          this.pWhitespaceDialog = this.loadFragment({
            name: "project3.view.fragment.comcdCustomer"
          });
        }
      
        this.pWhitespaceDialog.then(function (cValueHelpDialog) {
          var oFilterBar = cValueHelpDialog.getFilterBar();
          this.cValueHelpDialog = cValueHelpDialog;
          if (this._bWhitespaceDialogInitialized) {

            cValueHelpDialog.setTokens([]);
            cValueHelpDialog.setTokens(this._oWhiteSpacesInput.getTokens());
            cValueHelpDialog.update();
            cValueHelpDialog.open();
            return;
          }

          //다이얼로그 내 검색창
          this._oBasicSearchField = new SearchField({
            search: function () {
              this.cValueHelpDialog.getFilterBar().search();
            }.bind(this)
          });

          this.getView().addDependent(cValueHelpDialog);

          cValueHelpDialog.setRangeKeyFields([{
            label: "CompanyCode",
            key: "cmpCode_key"
          }]);

          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchField);

          cValueHelpDialog.getTableAsync().then(function (oTable) {
            oTable.setModel(this.oModel);

            if (oTable.bindRows) {
              oTable.addColumn(new UIColumn({ label: "회사 코드", template: oCodeTemplate }));
              oTable.addColumn(new UIColumn({ label: "회사명", template: oTextTemplate }));
              oTable.bindAggregation("rows", {
                path: "CompanyCodeModel>/",
                events: {
                  dataReceived: function () {
                    cValueHelpDialog.update();
                  }
                }
              });
            }

            if (oTable.bindItems) {
              oTable.addColumn(new MColumn({ header: new Label({ text: "회사 코드" }) }));
              oTable.addColumn(new MColumn({ header: new Label({ text: "회사명" }) }));
              oTable.bindItems({
                path: "CompanyCodeModel>/",
                template: new ColumnListItem({
                  cells: [new Label({ text: "{CompanyCodeModel>cmpCode_key}" }), new Label({ text: "{CompanyCodeModel>cmpCode_kor}" })]
                }),
                events: {
                  dataReceived: function () {
                    cValueHelpDialog.update();
                  }
                }
              });
            }

            cValueHelpDialog.update();
          }.bind(this));

          this._bWhitespaceDialogInitialized = true;
          cValueHelpDialog.open();
        }.bind(this));
      },

      //다이얼로그 확인 버튼 함수
      onValueHelpOkPress: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        tokenNum = aTokens.length;

        var cmp = [];
        for (let i = 0; i < tokenNum; i++) {
          aTokens[i].mProperties.text = aTokens[i].mProperties.key;
          cmp.push(aTokens[i].mProperties.text)
        }

        this._oWhiteSpacesInput.setTokens(aTokens)
        this.cValueHelpDialog.close();
      },

      //다이얼로그 취소 버튼 함수
      onValueHelpCancelPress: function () {
        this.cValueHelpDialog.close();
      },

      //다이얼로그 필터 기능
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
            new Filter({ path: "cmpCode_key", operator: FilterOperator.Contains, value1: sSearchQuery }),
            new Filter({ path: "cmpCode_kor", operator: FilterOperator.Contains, value1: sSearchQuery })
          ],
          and: false
        }));

        this._filterTableCompanyCode(new Filter({
          filters: aFilters,
          and: true
        }));
      },

      _filterTableCompanyCode: function (oFilter) {
        var oValueHelpDialog = this.cValueHelpDialog;
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


      /**
       * 생성페이지 이동 버튼 클릭 이벤트
       * @param oEvent {object}
       * @param sGubun {string}
       */

      //BP 생성 페이지로 이동
      onCreateCustomer: function (oEvent, sGubun) {

        let sRouteName = '';

        if (sGubun === 'Person') {
          sRouteName = 'createCustomerP';
        }

        if (sGubun === 'Organization') {
          sRouteName = 'createCustomerO';
        }

        this.getOwnerComponent().getRouter().navTo(sRouteName, {num:2});
      },

      //BP 삭제
      onDeleteCustomer: async function () {
        var totalNumber = this.getView().getModel("CustomerModel").oData.length;
        let model = this.getView().getModel("CustomerModel");
        let i;
        for (i = 0; i < totalNumber; i++) {
          let chk = '/' + i + '/CHK';
          let key = '/' + i + '/customerNumber';
          if (model.getProperty(chk) === true) {
            let customerNumber = model.getProperty(key);
            let url = "/customer/Customer/" + customerNumber;
            await $.ajax({
              type: "DELETE",
              url: url
            });

          }
        }

        this.onMyRoutePatternMatched();
      },

      //검색값 초기화
      onClearField: function () {
        this.getView().byId("name").setValue("");
        this.getView().byId("customerNumber").setValue("");
        this.getView().byId("cmpCode").setValue("");
        this.getView().byId("createDate").setValue("");
        this.getView().byId("country").setValue("");
        this.getView().byId("bpRange").setSelectedKey("");

      },

      //정렬 팝업
      onSort: function () {
        if (!this.byId("CSortDialog")) {
          Fragment.load({
            id: this.getView().getId(),
            name: "project3.view.fragment.CSortDialog",
            controller: this
          }).then(function (oDialog) {
            this.getView().addDependent(oDialog);
            oDialog.open();
          }.bind(this));
        } else {
          this.byId("CSortDialog").open();
        }

      },

      //정렬 팝업의 확인 버튼
      onConfirmCSortDialog: function (oEvent) {
        let mParams = oEvent.getParameters();
        let sPath = mParams.sortItem.getKey();
        let bDescending = mParams.sortDescending;
        let aSorters = [];

        aSorters.push(new Sorter(sPath, bDescending));

        let oBinding = this.byId("CustomerTable").getBinding("rows");
        oBinding.sort(aSorters);
      },

      //엑셀 다운로드 기능
      onDataExport: function () {
        let aCols, oRowBinding, oSettings, oSheet, oTable;

        oTable = this.byId('CustomerTable');
        oRowBinding = oTable.getBinding('rows');
        aCols = this.createColumnConfig();

        let oList = [];
        for (let j = 0; j < oRowBinding.oList.length; j++) {
          if (oRowBinding.aIndices.indexOf(j) > -1) {
            oList.push(oRowBinding.oList[j]);
          }
        }

        for (let i = 0; i < oList.length; i++) {
          if (oList[i].bpRange === 'A') {
            oList[i].bpRange2 = '개인(1)';
          }
          if (oList[i].bpRange === 'B') {
            oList[i].bpRange2 = '조직(2)';
          }
        }

        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: 'Level'
          },
          dataSource: oList,
          fileName: 'CustomerTable.xlsx',
          worker: false
        };
        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      //엑셀 파일
      createColumnConfig: function () {
        const aCols = [];

        aCols.push({
          label: '고객명',
          property: 'name',
          type: EdmType.String
        });
        aCols.push({
          label: '고객 번호',
          property: 'customerNumber',
          type: EdmType.Int32
        });
        aCols.push({
          label: '회사 코드',
          property: 'cmpCode',
          type: EdmType.String
        });
        aCols.push({
          label: '생성 일자',
          property: 'createDate',
          type: EdmType.String
        });
        aCols.push({
          label: '국가',
          property: 'country',
          type: EdmType.String
        });
        aCols.push({
          label: '비즈니스 파트너 범주',
          property: 'bpRange2',
          type: EdmType.String
        });

        return aCols;
      },

      //체크박스 체크 기능
      onCheckselect: function () {
        this.getView().getModel("CustomerModel");
   
      },

      //BP 상세 페이지로 이동
      onNavToDetail: function (oEvent) {
        let dParams = oEvent.getParameters();
        let sPath = dParams.row.oBindingContexts.CustomerModel.sPath;
        let data = this.getView().getModel("CustomerModel").getProperty(sPath);
        let selectedRange = data.bpRange;
        let sRouteName = '';

        var SelectedNum = data.customerNumber;
        if (selectedRange === 'A') {
          sRouteName = 'detailCustomerP';
        }

        if (selectedRange === 'B') {
          sRouteName = 'detailCustomerO';
        }

        this.getOwnerComponent().getRouter().navTo(sRouteName, { num: SelectedNum, ID:2 });
      }

    });
  }
);
