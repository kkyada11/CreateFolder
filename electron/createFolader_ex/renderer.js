// const $   = require(`./assets/js/lib/jquery-1.12.4.min`);
// const path = require('path');

// let body     = $('body');
// let sections = $('#contents').find('section');

// body.on('click', '#navi a', function(e){
//     sections.removeClass('isActive');
//     $(e.target.hash).addClass('isActive');
// });


/**
 * 0, 1만 존재
 * 연속된 숫자 0 또는 1로 조합
 * 0과 1의 갯수는 동일
 * 1010 : 10 + 10 중복 제외
 * */

window.onload = function () {
    var sample = '101001110';
    var answerArr = [];
    var reg = '(0|1)';
    var len = 0;
    String.prototype.existenceChat = function(){
        for (var i = 0; i < this.length; i++){
            if (this[i] === '0' || this[i] === '1'){
                continue;
                console.log('Yes');
            }
            alert('0,1을 제외한 값이 들어 왓습니다.');
            return false;
        }
        len = this.length;
        return true;
    };
    function chatCheck (str){
        var isTrue = sample.existenceChat(); // 0 , 1 검증;

        if (isTrue){
            for (var i = 0; i < str.length; i++){
                for (var j = 2; j <= str.length ; j++) {
                    // 0과 1의 갯수는 동일
                    // 1010 : 10 + 10 중복 제외
                    if (countChat(str.substr(i, j)) && answerArr.indexOf(str.substr(i, j)) === -1){
                        answerArr.push(str.substr(i, j));
                    }

                }
            }
            // answerCheck();
            console.log(answerArr);

        }
    }
    function countChat (str){
        var num0 = 0, num1 = 0;
        for (var i = 0; i < str.length; i++){
            if (str[i] === '0'){
                num0++;
            } else if(str[i] === '1') {
                num1++;
            }
        }
        return (num0 == num1);
    }
    /// 0,1 값만 받기
    chatCheck(sample); // init
    // console.log(countChat('1100'));


}