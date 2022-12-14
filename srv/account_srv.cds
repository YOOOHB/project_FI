using project_FI.account from '../db/account';

service AccountService {

    entity Account as projection on account.Account;
    entity COA as projection on account.COA;
    entity CompanyCode as projection on account.CompanyCode;
}