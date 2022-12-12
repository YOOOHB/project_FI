sap.ui.define([

], function () {
    "use strict";

    // 연산자 연습
    // var num1 = 10;
    // var num2 = 3;

    // num1 += num2;
    // document.write(num1, "<br/>");
    // num1 -= num2;
    // document.write(num1, "<br/>");
    // num1 *= num2;
    // document.write(num1, "<br/>");
    // num1 %= num2;
    // document.write(num1, "<br/>");



    // 삼항 조건 연산자 -> 조건식? 실행문1(TRUE): 실행문2(FALSE);

    // var a = 1;
    // document.write(a, "<br/>");

    // document.write(a++, "<br/>");
    // document.write(a, "<br/>");
    // document.write(++a, "<br/>");
    // document.write(a, "<br/>");
    // a -= 1;
    // document.write(a, "<br/>");
    // a =- 1;
    // document.write(a, "<br/>");

    // var a = 13;
    // var b = 12;
    // var result;
    // result = b++;
    // document.write(result, "<br/>")
    // var num = a == result ? b == result ? "hello" : "hi" : "HELLO"
    // document.write(num, "<br/>")

    // var walkAmount = prompt("당신의 하루 걷는 양은 몇 보인가요?");
    // if (walkAmount >= 10000) {
    //     document.write("매우 좋은 습관을 지니고 계시는군요.");
    // }
    // else {
    //     document.write("안 좋은 습관을 가지고 계시는군요.")
    // }

    // var a = prompt("4자리 이상의 양의 정수를 입력해주세요.");
    // if (a % 3 == 0) {
    //     document.write(a + "은 3의 배수입니다.");       // +로 숫자와 문자열을 합치면 숫자도 문자로 자료형 변경
    // }
    // else {
    //     document.write(a, "은 3의 배수가 아닙니다.")   // ,로 숫자와 문자열 합치면 자료형 그대로
    // }

    // if , else if, else 문 : 위에서 아래로부터 순서대로
    // var mon = prompt("현재는 몇 월입니까?","0"); // <-- 0을 넣어주는 이유는 프롬프트 창에서 기본값을 '0'으로
    // if (mon >= 9 && mon <= 11){
    //     document.write("독서의 계절 가을이네요!!");
    // } else if ( mon >= 6 && mon <= 8){
    //     document.write("여행 가기 좋은 여름이네요!!");
    // } else if ( mon >= 3 && mon <= 5){
    //     document.write("햇살 가득한 봄이네요!!");
    // } else{
    //     document.write("스키의 계절 겨울이네요!!");
    // }

    // var a = prompt("양의 정수를 입력해주세요.");
    // if (a % 6 == 0) {
    //     document.write(a + "은(는) 6의 배수입니다.");
    // } else if (a % 2 == 0) {
    //     document.write(a + "은(는) 2의 배수입니다.");
    // } else if (a % 3 == 0) {
    //     document.write(a + "은(는) 3의 배수입니다.");
    // } else {
    //     document.write(a + "은(는) 2의 배수도, 3의 배수도, 6의 배수도 아닙니다.");
    // }

    // var hour = prompt("시간을 입력해주세요.");
    // var min = prompt("분을 입력해주세요");

    // if (min >= 45 && min <= 60) {
    //     document.write(hour, "시 ", min - 15, "분");
    // } else if (min < 45 && min >= 0 && hour == 0) {
    //     document.write("23시 ", min - (-15), "분");
    // } else if (min < 45 && min >= 0) {
    //     document.write(--hour, "시 ", min - (-15), "분");
    // }

    // var id = "SAPUSER01"
    // var pw = "123456"

    // var userId = prompt("아이디를 입력하세요.")

    // if(userId == id){
    //     var userPw = prompt("비밀번호를 입력하세요.")
    //     if(userPw == pw){
    //         document.write(id+"님 반갑습니다!")
    //     }else{
    //         alert(id+"님 비밀번호가 틀렸습니다!")
    //     }
    // }else{
    //     alert("올바른 아이디가 아닙니다.")
    // }


    // var site = prompt("네이버, 다음, 네이트, 구글 중 즐겨 사용하는 포털 검색 사이트는?");
    // var url;
    // switch (site) {
    //     case "네이버": url = "www.naver.com";
    //         break;                              // switch 문에서 case가 끝날때마다 break를 걸어줘야함
    //     case "다음": url = "www.daum.net";
    //         break;
    //     case "네이트": url = "www.nate.com";
    //         break;
    //     case "구글": url = "www.google.com";
    //         break;
    //     //일치하는 값이 없을 경우
    //     default: alert("보기 중에 없는 사이트입니다.")  // (일반적으로)default를 사용할 때는 case의 마지막에 위치
    // }
    // if (url) {
    //     window.open("https://"+url);
    // }

    // var month = Number(prompt("월을 입력해주세요."));
    // var day;

    // switch (month) {
    //     case 1:
    //     case 3: day = 31;
    //         break;
    //     case 2: day = 28;
    //         break;
    //     case 4:
    //     case 6: day = 30;
    //         break;
    //     default: alert("보기 중에 없는 사이트입니다.");
    // }
    // if(day) {
    //     document.write(month + "월은 " + day + "일까지 있습니다.");
    // }


    // var a = 1;
    // while (a <= 10) {
    //     document.write(a, "</br>");
    //     a++;
    // }

    // var i = 10;
    // do {
    //     document.write("hello!!" + i + "</br>");
    //     i--;
    // } while (i > 3) // 변수 i의 값이 3이거나 3보다 작으면 while 문 종료


    // for(var i = 1; i <= 10; i++){
    //     document.write("반복"+i+"<br/>");
    // }

    // var num = prompt("몇 단을 출력하시겠습니까?")

    // for (var i = 1; i <= 9; i++) {
    //     document.write(num + (" * ") + i + " = " + num * i + "</br>");
    // }

    // var num = prompt("몇 단을 출력하시겠습니까?")
    // var i = 1;

    // while (i <= 9) {
    //     document.write(num + (" * ") + i + " = " + num * i + "</br>");
    //     i++;
    // }

    // var num = prompt("몇 단을 출력하시겠습니까?")
    // var i = 1;

    // do {
    //     document.write(num + (" * ") + i + " = " + num * i + "</br>");
    //     i++;
    // } while (i <= 9)


    // document.write("1단부터 9단까지 출력"+"<br/>");

    // for (var a = 1; a <= 9; a++) {
    //     document.write("<br/>"+ a + "단" + "<br/>")
    //     for (var i = 1; i <= 9; i++) {
    //         document.write(a + " * " + i + " = " + a * i + "<br/>");
    //     }
    // }

    // for(var i =1; i <= 10; i++){
    //     if(i==6) {
    //         break;           // break : 해당 조건이면 그냥 멈춤
    //     }
    //     document.write(i,"</br>");
    // }

    // for(var i = 1 ; i<=10; i++){
    //     if (i%2==0){
    //         continue;
    //     }
    //     document.write(i,"<br/>");
    // }



    // var inputNum = prompt("0~99까지의 정수중 하나를 입력하세요.");
    // var newNum = parseInt((inputNum % 10) * 10) + parseInt((inputNum / 10 + inputNum % 10) % 10);

    // for (var cycleNum = 1;; cycleNum++) {
    //     if (newNum != inputNum) {
    //         newNum = parseInt((newNum % 10) * 10) + parseInt((newNum / 10 + newNum % 10) % 10);
    //     } else {
    //         break;
    //     }
    // }
    // document.write(cycleNum);

    // var inputNum = prompt("0~99까지의 정수중 하나를 입력하세요.");
    // var newNum = parseInt((inputNum % 10) * 10) + parseInt((inputNum / 10 + inputNum % 10) % 10);

    // var cycleNum = 1;
    // do{
    // {
    //     newNum = parseInt((newNum % 10) * 10) + parseInt((newNum / 10 + newNum % 10) % 10);
    //     ++cycleNum
    // }
    // }while(newNum != inputNum)  // while의 조건문이 거짓이면 반복문이 도는거니까 '같지 않다'로 둬야함.

    // document.write(cycleNum);


});