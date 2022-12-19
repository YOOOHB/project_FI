sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController, JSONModel) {
      "use strict";

      let SelectedNum;

      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
  
      return BaseController.extend("project3.controller.changeCustomerP", {
        
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("changeCustomerP").attachPatternMatched(this.onMyRoutePatternMatched, this);


            this.byId("changeDate").setText(year+ '-' + month + '-' + date);
            

        },
        
        onMyRoutePatternMatched: async function(oEvent){
          SelectedNum = oEvent.getParameter("arguments").num;
            let url = "/customer/Customer/" + SelectedNum;

            // CusomerModel 선언
            const Customer = await $.ajax({
                type: "get",
                url: url
              });

            let CustomerModel = new JSONModel(Customer);
            this.getView().setModel(CustomerModel, "CustomerModel");
            //

            // orderHoldModel 선언
            const forOrderHold = await $.ajax({
              type: "get",
              url: "/customer/OrderHold"
            });
            
            let orderHoldModel = new JSONModel(forOrderHold.value);
            this.getView().setModel(orderHoldModel, "orderHoldModel");
            //

            // requestHoldModel 선언
            const forRequestHold = await $.ajax({
              type: "get",
              url: "/customer/RequestHold"
            });

            let requestHoldModel = new JSONModel(forRequestHold.value);
            this.getView().setModel(requestHoldModel, "requestHoldModel");
            
            // customerClassModel 선언
            const forCustomerClass = await $.ajax({
              type: "get",
              url: "/customer/CustomerClass"
            });

            let customerClassModel = new JSONModel(forCustomerClass.value);
            this.getView().setModel(customerClassModel, "customerClassModel");
          },
          
          onConfirm: async function() {


            if(this.byId("orderHold").getSelectedItem() === null ){
              var orderHoldText = ""
            } else {
              var orderHoldText = this.byId("orderHold").getSelectedItem().mProperties.text
            }

            if(this.byId("requestHold").getSelectedItem() === null ){
              var requestHoldText = ""
            } else {
              var requestHoldText = this.byId("requestHold").getSelectedItem().mProperties.text
            }
            
            if(this.byId("customerClass").getSelectedItem() === null ){
              var customerClassText = ""
            } else {
              var customerClassText = this.byId("customerClass").getSelectedItem().mProperties.text
            }

            var edit = {
              
              modifier : this.byId("modifier").getValue(),
              changeDate : year+ '-' + month + '-' + date,
              orderHold : orderHoldText,
              requestHold : requestHoldText,
              // postHold : Boolean(this.byId("postHold").getSelected()),
              customer : customerClassText,
              street : this.byId("street").getValue(),
              houseNumber : this.byId("houseNumber").getValue(),
              postalCode : this.byId("postalCode").getValue(),
              city : this.byId("city").getValue(),
              country : this.byId("country").getValue(),
              region : this.byId("region").getValue()
            };

          let url = "/customer/Customer/" + SelectedNum;
          await $.ajax({
            type: "patch",
            url: url,
            contentType: "application/json;IEEE754Compatible=true",
            data:JSON.stringify(edit)
          });

          this.onCancel();

        },

        onCancel: function() {
          SelectedNum = this.byId("customerNumber").mProperties.text;
          // console.log(SelectedNum);
  
          this.getOwnerComponent().getRouter().navTo("detailCustomerP", {num:SelectedNum})
        }
      });
    }
  );
  