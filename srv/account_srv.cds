using project_FI.account from '../db/account';

service AccountService {

    entity COA as projection on account.COA;
    entity Grp as projection on account.Grp;
    entity GLAcc as projection on account.GLAcc;
    entity CmpCode as projection on account.CmpCode;
    entity AccCategory as projection on account.AccCategory;
}