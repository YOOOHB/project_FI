sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "../model/Cformatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/SearchField",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/m/SearchField"
  ],
  function (Controller, Cformatter, JSONModel, SearchField, Fragment, Sorter) {
    "use strict";

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

      onInit: async function () {
        this.getOwnerComponent().getRouter().getRoute("Customer").attachPatternMatched(this.onMyRoutePatternMatched, this);
      },

      onMyRoutePatternMatched: async function () {
        let Customer = await $.ajax({
          type: "get",
          url: "/customer/Customer"
        });

        let CustomerModel = new JSONModel(Customer.value);
        this.getView().setModel(CustomerModel, "CustomerModel");

        let bpRange = await $.ajax({
          type: "get",
          url: "/customer/bpRange"
        });

        let bpRangeModel = new JSONModel(bpRange.value);
        this.getView().setModel(bpRangeModel, "bpRangeModel");

        console.log(bpRange)
        console.log(bpRangeModel)
      },

      onSearch: function (oEvent) {
        const oView = this.getView(),
          oSearchModel = oView.getModel('search'),
          oSearchData = oSearchModel.getProperty('/');
      },

      onFilterChange: function () {

      },

      onAfterVariantLoad: function () {

      },

      onBack: function () {
        this.getOwnerComponent().getRouter().navTo("homeCustomer");
      },

      onValueHelpRequest: function () {
        this._oBasicSearchField = new SearchField();

        if (!this.pValueHelpDialog) {
          this.pValueHelpDialog = this.loadFragment({
            name: "project3.view.fragment.comcdCustomer"
          });
        }
        this.pValueHelpDialog.then(function (oDialog) {
          oDialog.open();
        });

      },

      onValueHelpOkPress: function () {

      },

      onValueHelpCancelPress: function () {

      },

      onFilterBarSearch: function () {

      },


      /**
       * 생성페이지 이동 버튼 클릭 이벤트
       * @param oEvent {object}
       * @param sGubun {string}
       */
      onCreateCustomer: function (oEvent, sGubun) {

        let sRouteName = '';

        if (sGubun === 'Person') {
          sRouteName = 'createCustomerP';
        }

        if (sGubun === 'Organization') {
          sRouteName = 'createCustomerO';
        }

        this.getOwnerComponent().getRouter().navTo(sRouteName);
      },

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
        this.onSearch();

      },

      onConfirmCSortDialog: function (oEvent) {
        let mParams = oEvent.getParameters();
        let sPath = mParams.sortItem.getKey();
        let bDescending = mParams.sortDescending;
        let aSorters = [];

        aSorters.push(new Sorter(sPath, bDescending));

        let oBinding = this.byId("CustomerTable").getBinding("rows");
        oBinding.sort(aSorters);
      },

      onDataExport: function () {

      },

      onNavToDetail: function (oEvent) {
        let dParams = oEvent.getParameters();
        let sPath = dParams.row.oBindingContexts.CustomerModel.sPath;
        let data = this.getView().getModel("CustomerModel").getProperty(sPath);
        console.log(data);
        let selectedRange = data.bpRange;
        console.log(selectedRange);
        let sRouteName = '';

        var SelectedNum = data.customerNumber;
        
        if (selectedRange === 'A') {
          sRouteName = 'detailCustomerP';

        }

        if (selectedRange === 'B') {
          sRouteName = 'detailCustomerO';
        }

        this.getOwnerComponent().getRouter().navTo(sRouteName, {num: SelectedNum});
      }



    });
  }
);
