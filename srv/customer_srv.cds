using project_FI.customer from '../db/customer';

service CustomerService {

    entity Customer as projection on customer.Customer;
    entity CountryRegion as projection on customer.CountryRegion;
    entity OrderHold as projection on customer.OrderHold;
    entity CustomerClass as projection on customer.CustomerClass;
    entity RequestHold as projection on customer.RequestHold;
    entity lgForm as projection on customer.lgForm;
    entity bpRange as projection on customer.bpRange;

}