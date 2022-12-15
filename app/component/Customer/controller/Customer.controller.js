sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(Controller, JSONModel) {
      "use strict";
  
      return Controller.extend("project3.controller.Customer", {
        // 프로그램 처음 실행할때 딱한번만 실행되는 함수.
        onInit: function() {
          // this -> Controller
          // Controller._initModel();
          this._initModel();
        },

        /**
         * 처음 모델을 세팅하는 함수.
         */
        _initModel: function() {
          /**
           * jsonModel - two-Binding - view <-> model 실시간 연동
           * 
           */
          this.getView()
              .setModel(
                new JSONModel({}),
                'search'
              )
        },

        onSearch: function(oEvent) {
          const oView = this.getView(),
                oSearchModel = oView.getModel('search'),
                oSearchData = oSearchModel.getProperty('/');
          debugger;
        },

        onValueHelpRequest : function () {
           if (!this.pValueHelpDialog) {
               this.pValueHelpDialog = this.loadFragment({
                 name: "project3.view.fragment.comcdCustomer"
               });
           }
           this.pValueHelpDialog.then(function(oDialog){
                oDialog.open();
           });
      }

        // pull 성공!!
		
      });
    }
  );
  