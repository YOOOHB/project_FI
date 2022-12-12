namespace project_FI.company;

entity Company {
    key comcode       : String @title : '업체 코드';
        comname       : String @title : '업체명';
        comaddress    : String @title : '주소';
        comperson     : String @title : '담당자';
        comcontact    : String @title : '담당자 연락처';
        comgood       : String @title : '거래 품목';
        comdate       : String @title : '업체 등록일';
        comstate      : String @title : '신용 상태';


};

entity Company_State {
    key company_state_key : String @title : '요청상태 키워드';
        company_state_kor : String @title : '요청상태 한국어';
};