namespace project_FI.account;

entity COA {
    key accChart    : String @title : '계정과목표';
        accContents : String @title : '내역';
};

entity Grp {
    key ID          : String @title : '번호';
        accChart    : String @title : '계정과목표';
        accGroup    : String @title : '계정 그룹';
        accMean     : String @title : '의미';
};

entity GLAcc {
    key ID          : String @title : '번호';
        accNumber   : String @title : '계정 번호';
        createDate  : String @title : '생성일'; 
        accChart    : String @title : '계정과목'; 
        accCategory : String @title : '계정 유형';
        accGroup    : String @title : '계정그룹'; 
        creator     : String @title : '생성자';
        accContents : String @title : '내역';
};

entity CmpCode {
    key cmpCode         : String @title : '회사코드';
        cmpName         : String @title : '회사이름';
        accCurrency     : String @title : '계정 통화';
        accChart        : String @title : '계정과목표';
        GLAccKey        : String @title : '3번 키 값, 해당 G/L Num에 대응하는 cmpCode를 가져오기 위함';
};

entity AccCategory{
    key accCategory_key: String  @title : 'G/L계정 유형 키워드';
    key accCategory_kor: String  @title : 'G/L계정 유형 한국어';
};