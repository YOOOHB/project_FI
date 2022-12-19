namespace project_FI.customer;

entity Customer {
    key customerNumber : Integer @title : '고객 번호';
        bpRange        : String  @title : 'BP 범주';
        personalTitle  : String  @title : '개인 칭호';
        lastName       : String  @title : '이름';
        firstName      : String  @title : '성';
        name           : String  @title : '고객 명';
        createDate     : String  @title : '생성일';
        street         : String  @title : '도로 주소';
        houseNumber    : String  @title : '번지';
        postalCode     : String  @title : '우편번호';
        city           : String  @title : '도시';
        country        : String  @title : '국가/지역';
        region         : String  @title : '지역';
        cmpCode        : String  @title : '회사코드';
        changeDate     : String  @title : '최종 변경일';
        modifier       : String  @title : '최종 변경자';
        orderHold      : String  @title : '오더 보류';
        customer       : String  @title : '고객 분류';
        accGroup       : String  @title : '고객 계정 그룹';
        requestHold    : String  @title : '청구 보류';
        postHold       : Boolean default false  @title : '전기 보류';
        currency       : String  @title : '통화';
        orgName        : String  @title : '조직명칭';
        lgForm         : String  @title : '법적 형태';


};

entity CountryRegion {
    key countryCode : String @title : '국가 코드';
    key country     : String @title : '국가/지역 이름';
};

entity OrderHold {
    key orderHold_key : String @title : '오더 보류 키워드';
    key orderHold_kor : String @title : '오더 보류 한국어';
};

entity CustomerClass {
    key customer_key : String @title : '고객 분류 키워드';
    key customer_kor : String @title : '고객 분류 한국어';
};

entity RequestHold {
    key requestHold_key : String @title : '청구 보류 키워드';
    key requestHold_kor : String @title : '청구 보류 한국어';
};

entity lgForm {
    key lgForm_key : String @title : '법적 형태 키워드';
    key lgForm_kor : String @title : '법적 형태 한국어';
};

entity bpRange {
    key bpRange_key : String @title : 'BP 범주 키워드';
    key bpRange_kor : String @title : 'BP 범주 한국어';
};

entity cmpCode {
    
    key cmpCode_key : String @title : '회사 코드';
    key cmpCode_kor : String @title : '회사명';
};