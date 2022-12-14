sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "../model/Cformatter",
        "../model/Pformatter",
        "sap/m/MessageBox"
    ],
    function(BaseController, JSONModel, Cformatter, Pformatter, MessageBox) {
      "use strict";

      let number;
      let SelectedNum;

      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
  
      return BaseController.extend("project3.controller.changeCustomerO", {
        Cformatter: Cformatter,
        Pformatter: Pformatter,
        
        
        onInit() {
            this.getView().byId("modifier").setValueState("None");
            this.getView().byId("modifier").setValue("");
            
            
            this.getOwnerComponent().getRouter().getRoute("changeCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("detailCustomerO").attachPatternMatched(this.onMyRoutePatternMatched, this);
            this.getOwnerComponent().getRouter().getRoute("homeCustomer").attachPatternMatched(this.onMyRoutePatternMatched, this);
            
            this.byId("changeDate").setText(year+ '-' + month + '-' + date);
            
            
          },
          
          onMyRoutePatternMatched: async function(oEvent){
          number = oEvent.getParameter("arguments").number;

          this.getView().byId("modifier").setValue("");

          this.getView().byId("modifier").setValueState("None")

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
            var orderHoldkeyText = ""
          } else {
            var orderHoldText = this.byId("orderHold").getSelectedItem().mProperties.text
            var orderHoldkeyText = this.byId("orderHold").getSelectedItem().mProperties.key
          }

          if(this.byId("requestHold").getSelectedItem() === null ){
            var requestHoldText = ""
            var requestHoldkeyText = ""
          } else {
            var requestHoldText = this.byId("requestHold").getSelectedItem().mProperties.text
            var requestHoldkeyText = this.byId("requestHold").getSelectedItem().mProperties.key
          }
          
          if(this.byId("customerClass").getSelectedItem() === null ){
            var customerClassText = ""
            var customerClasskeyText = ""
          } else {
            var customerClassText = this.byId("customerClass").getSelectedItem().mProperties.text
            var customerClasskeyText = this.byId("customerClass").getSelectedItem().mProperties.key
          }

          var edit = {
            
            modifier : this.byId("modifier").getValue(),
            changeDate : year+ '-' + month + '-' + date,
            orderHold : orderHoldText,
            orderHold_key : orderHoldkeyText,
            requestHold : requestHoldText,
            requestHold_key : requestHoldkeyText,
            postHold : Boolean(this.byId("postHold").getSelected()),
            customer : customerClassText,
            customer_key : customerClasskeyText,
            street : this.byId("street").getValue(),
            houseNumber : this.byId("houseNumber").getValue(),
            postalCode : this.byId("postalCode").getValue(),
            city : this.byId("city").getValue(),
            country : this.byId("country").getValue(),
            region : this.byId("region").getValue(),
            manager : this.byId("manager").getValue()
          };

          if(!edit.modifier){
            this.getView().byId("modifier").setValueState("Error");
            MessageBox.error("최종 변경자를 입력하세요.");
            return;
          }

        let url = "/customer/Customer/" + SelectedNum;
        await $.ajax({
          type: "patch",
          url: url,
          contentType: "application/json;IEEE754Compatible=true",
          data:JSON.stringify(edit)
        });

        this.onCancel();
        this.getView().byId("modifier").setValue("")

      },

        onCancel: function() {
          if (number == "1") {
            this.getOwnerComponent().getRouter().navTo("detailCustomerO", {num:SelectedNum, ID:1});
          } else if (number == "2") {
            this.getOwnerComponent().getRouter().navTo("detailCustomerO", {num:SelectedNum, ID:2});
          }
            this.getView().byId("modifier").setValueState("None")
            this.getView().byId("modifier").setValue("")
        }
      });
    }
  );
  