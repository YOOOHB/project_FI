namespace project_FI.account;

entity Account {
    key accNumber   : String @title : 'G/L계정 번호';
        accCategory : String  @title : 'G/L계정 유형';
        accChart    : String  @title : '계정과목표';
        accGroup    : String  @title : '계정 그룹';
        cmpName     : String  @title : '회사이름';
        cmpCode     : String  @title : '회사코드';
        createDate  : String  @title : '생성일';
        creator     : String  @title : '생성자';
        accCurrency : String  @title : '계정 통화';
        accContents : String  @title : '내역';
        accMean     : String  @title : '의미';

};

entity COA {
    key accChart  : String  @title : '계정과목표';
        accNumber : String @title : 'G/L계정 번호';
        accGroup  : String  @title : '계정 그룹';

};

entity CompanyCode {
    key cmpCode     : String @title : '회사코드';
        cmpName     : String @title : '회사이름';
        accCurrency : String @title : '계정 통화';
        accChart    : String @title : '계정과목표';

};

entity AccCategory {
    key accCategory_key : String @title : 'G/L계정 유형 키워드';
    key accCategory_kor : String @title : 'G/L계정 유형 한국어';
};
