sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"

], function(Controller,JSONModel,Fragment,Filter, FilterOperator,MessageBox) {
  "use strict";

  let Today, CreateNum;
  let num;

  return Controller.extend("project3.controller.createCustomerP", {

    onInit: function(){

      const myRoute = this.getOwnerComponent().getRouter().getRoute("createCustomerP");
      myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);



    },


    onMyRoutePatternMatched: async function(e){
      num = e.getParameter("arguments").num;

      this.getView().byId("lastName").setValueState("None");
      this.getView().byId("firstName").setValueState("None");
      this.getView().byId("cmpCode").setValueState("None");

      this.onClearField();
      console.log("hi!")
      
      const Customer = await $.ajax({
        type: "get",
        url: "/customer/Customer"
     });

     let Today;

     let now = new Date();
     Today = now.getFullYear() + "-" + (now.getMonth()+1).toString().padStart(2,'0') + "-" + now.getDate().toString().padStart(2,"0");
  
      let CustomerModel = new JSONModel(Customer.value);
      this.getView().setModel(CustomerModel, "CustomerModel");
      console.log(this.getView().getModel("CustomerModel"));
      var CustomerModelData = CustomerModel.oData;
      console.log(CustomerModelData);
      var Customerlength = CustomerModelData.length;
      console.log(Customerlength);
      var newNumber = CustomerModelData[Customerlength-1].customerNumber + 1;
      
      this.byId("customerNumber").setText(newNumber);
      this.byId("createDate").setText(Today);


      const CountryRegion = await $.ajax({
        type: "get",
        url: "/customer/CountryRegion"
     });

     
     let CountryRegionModel = new JSONModel(CountryRegion.value);
     this.getView().setModel(CountryRegionModel, "CountryRegionModel");

     console.log(this.getView().getModel("CountryRegionModel"));


     this.getView().byId("lastName").focus();


     const Companydata = await $.ajax({
      type: "get",
      url: "/customer/cmpCode"
   });

   
   let CompanyModel = new JSONModel(Companydata.value);
   this.getView().setModel(CompanyModel, "CompanyModel");

   console.log(this.getView().getModel("CompanyModel"));

    
  },

    

    onBack: function(){

      if (num == "1") {
        this.getOwnerComponent().getRouter().navTo("homeCustomer");
      } else if (num == "2") {
        this.getOwnerComponent().getRouter().navTo("Customer");
      }

        this.getView().byId("lastName").setValueState("None");
        this.getView().byId("firstName").setValueState("None");
        this.getView().byId("cmpCode").setValueState("None");

    },

    errorclear: function() {
      this.getView().byId("lastName").setValueState("None");
      this.getView().byId("firstName").setValueState("None");
      this.getView().byId("cmpCode").setValueState("None");
    },

    onCreate: async function () {
      this.errorclear();
      var lastName = this.byId("lastName").getValue();
      var firstName = this.byId("firstName").getValue();
      var name = firstName + lastName;
      var temp ={
        customerNumber : parseInt(this.byId("customerNumber").getText()),
        bpRange : this.byId("bpRange").getSelectedKey(),
        personalTitle : this.byId("personalTitle").getSelectedKey(),
        lastName : this.byId("lastName").getValue(),
        firstName : this.byId("firstName").getValue(),
        createDate : this.byId("createDate").getText(),
        manager : this.byId("manager").getValue(),
        street : this.byId("street").getValue(),
        houseNumber : this.byId("houseNumber").getValue(),
        postalCode : this.byId("postalCode").getValue(),
        city : this.byId("city").getValue(),
        country : this.byId("country").getValue(),
        region : this.byId("region").getValue(),
        cmpCode : this.byId("cmpCode").getValue(),
        currency : this.byId("currency").getValue(),
        changeDate:null,
        modifier:null,
        orderHold:null,
        customer:null,
        accGroup:"??????(CUST)",
        orgName:null,
        lgForm:null,
        postHold:null,
        requestHold:null,
        name: name,
        orderHold_key:null,
        requestHold_key:null,
        customer_key:null,
        bankKey: this.byId("bankKey").getValue(),
        bankNumber: this.byId("bankNumber").getValue()

      }
      
      console.log(temp.lastName);
      // ????????? ??????
      if(!temp.lastName || !temp.firstName || !temp.cmpCode){
        if(!temp.lastName){
          this.getView().byId("lastName").setValueState("Error");
        }
        if(!temp.firstName){
          this.getView().byId("firstName").setValueState("Error");
        }
        if(!temp.cmpCode){
          this.getView().byId("cmpCode").setValueState("Error");
        }
        MessageBox.error("?????? ?????? ?????? ??????????????????.");
        return;
      }

      await $.ajax({
        type: "POST",
        url: "/customer/Customer",
        contentType: "application/json;IEEE754Compatible=true",
        data:JSON.stringify(temp)
      });

      this.onClearField();
      this.onBack();
    },

    onClearField: function() {
      // this.getView().byId("customerNumber").setValue("");
      this.getView().byId("bpRange").setSelectedKey("A");
      this.getView().byId("personalTitle").setSelectedKey("Mr.");
      this.getView().byId("lastName").setValue("");
      this.getView().byId("firstName").setValue("");
      // this.getView().byId("createDate").setValue("");
      this.getView().byId("manager").setValue("");
      this.getView().byId("street").setValue("");
      this.getView().byId("houseNumber").setValue("");
      this.getView().byId("postalCode").setValue("");
      this.getView().byId("city").setValue("");
      this.getView().byId("country").setValue("");
      this.getView().byId("region").setValue("");
      this.getView().byId("cmpCode").setValue("");
      this.getView().byId("currency").setValue("");
      this.getView().byId("bankKey").setValue("");
      this.getView().byId("bankNumber").setValue("");



   


    },

    onValueHelpRequest : function () {
      if (!this.pValueHelpDialog) {
          this.pValueHelpDialog = this.loadFragment({
            name: "project3.view.fragment.country"
          });
      }
      this.pValueHelpDialog.then(function(oDialog){
           oDialog.open();
      });
     },
     onSearch1 : function() {

      // let code = this.byId("countryCode").getValue();
      let country = this.byId("fragcountry").getValue();

      var aFilter1 = [];

    
      // if (code) {aFilter1.push(new Filter("code", FilterOperator.Contains, code))}
      if (country) {aFilter1.push(new Filter("country", FilterOperator.Contains, country))}

      let oTable = this.byId("countryTable1").getBinding("rows");
      console.log(oTable);
      oTable.filter(aFilter1);
  },

  onReset1 : function(){
      // this.byId("countryCode").setValue("");
      this.byId("fragcountry").setValue("");
      this.onSearch1();

  },

  onCloseDialog : function() {
      this.byId("compop").close();
      this.pDialog = null;
      this.onReset1();
  },

  onCellClick : function (oControlEvent) {
          console.log(oControlEvent.getParameters());
          console.log(oControlEvent.getParameters().rowBindingContext);
          console.log(oControlEvent.getParameters().rowBindingContext.sPath);

          var path =oControlEvent.getParameters().rowBindingContext.sPath;
          console.log(path);
          var data = this.getView().getModel("CountryRegionModel").getProperty(path);

          console.log(data);
          // console.log(data.code);
          console.log(data.country);

          // this.byId("countryCode").setValue(data.code);
          this.byId("country").setValue(data.country);
          this.byId("compop").close();

  },

  onValueHelpRequest2 : function () {
    if (!this.pValueHelpDialog1) {
        this.pValueHelpDialog1 = this.loadFragment({
          name: "project3.view.fragment.company"
        });
    }
    this.pValueHelpDialog1.then(function(oDialog1){
         oDialog1.open();
    });
   },
   onSearch2 : function() {

    // let code = this.byId("countryCode").getValue();
    let cmpCode_kor = this.byId("fragcomname").getValue();

    var aFilter1 = [];

  
    // if (code) {aFilter1.push(new Filter("code", FilterOperator.Contains, code))}
    if (cmpCode_kor) {aFilter1.push(new Filter("cmpCode_kor", FilterOperator.Contains, cmpCode_kor))}

    let oTable = this.byId("companyTable1").getBinding("rows");
    console.log(oTable);
    oTable.filter(aFilter1);
},

onReset2 : function(){
    // this.byId("countryCode").setValue("");
    this.byId("fragcomname").setValue("");
    this.onSearch2();

},

onCloseDialog2 : function() {
    this.byId("compop2").close();
    this.pDialog1 = null;
    this.onReset2();
},

onCellClick2 : function (oControlEvent) {
        console.log(oControlEvent.getParameters());
        console.log(oControlEvent.getParameters().rowBindingContext);
        console.log(oControlEvent.getParameters().rowBindingContext.sPath);

        var path2 =oControlEvent.getParameters().rowBindingContext.sPath;
        console.log(path2);
        var data2 = this.getView().getModel("CompanyModel").getProperty(path2);

        console.log(data2);
        // console.log(data.code);
        console.log(data2.cmpCode_kor);

        // this.byId("countryCode").setValue(data.code);
        this.byId("cmpCode").setValue(data2.cmpCode_key);
        this.byId("compop2").close();

},


onBack1: function(){

  if (num == "1") {
    this.getOwnerComponent().getRouter().navTo("homeCustomer");
  } else if (num == "2") {
    this.getOwnerComponent().getRouter().navTo("Customer");
  }
  this.getView().byId("lastName").setValueState("None");
  this.getView().byId("firstName").setValueState("None");
  this.getView().byId("cmpCode").setValueState("None");





  

}


    
  });
});