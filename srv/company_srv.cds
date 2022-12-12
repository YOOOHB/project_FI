using project_FI.company from '../db/company';

service CompanyService {

    entity Company as projection on company.Company;
    entity Company_State as projection on company.Company_State;

}