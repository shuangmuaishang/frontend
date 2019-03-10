//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import Vue from 'vue/dist/vue.common.js';
// var Vue = require('vue');
var ws;
var question = new Vue({
    el: '.question',
    data: {
        // 三种动画状态
        loadingShow: true,
        startShow: false,
        playingShow: false,

        // 用户的昵称和头像
        theirAvatar: '',
        theirNickname: '',

        // 题目与选项
        nowQuestion: '',
        nowOptions: {
            A: '',
            B: '',
            C: ''
        },
        nowAnswer: '',
        isThree: true,
        isRight: false,

        page: 0,

        myScores: 0,
        hisScores: 0,
        // 我方对方答题状况
        chooseMyOption: false,
        chooseHisOption: false,
        chatBoardShow: false,
    },
    components: {

    },
    methods: {
        // 聊天版切换
        chatBoard: function() {
            this.chatBoardShow = !this.chatBoardShow;
        },
        questionInit: function() {
            this.nowQuestion = '';
            this.nowOptions = {
                A: '',
                B: '',
                C: ''
            };
            this.nowAnswer = '';
            this.isThree = true;
            this.isRight = false;
            this.chooseMyOption = false;
            this.chooseHisOption = false;
            this.chatBoardShow = false;
            var btnlist = document.querySelectorAll('.answer-list');
            btnlist.forEach(function(el, index) {
                el.classList.remove('option-right', 'option-wrong', 'my-right', 'his-right');
            })
        },
        transformABC: function(para) {
            switch (para) {
                case 'A':
                    return 0;
                case 'B':
                    return 1;
                case 'C':
                    return 2;
                default:
                    return 0;
            }
        },
        clickMyBtn: function(e) {
            if (this.chooseMyOption) {
                return;
            }
            this.chooseMyOption = e.target.getAttribute('data-answer');
            this.showAnswer(1);
            // e.target.classList.add(this.judgeAnswer(answer));
            // this.chooseMyOption = true;
            // 如果对面已经选过了，则直接公布答案与对错情况
            if (this.chooseHisOption) {
                this.showAnswer();
                this.sendMyAnswer();
            }
        },
        sendMyAnswer: function() {
            ws.send(JSON.stringify({
                "op": "answer",
                "data": {
                    "answer": this.chooseMyOption,
                    "right": 1,
                    "score": 200
                }
            }));
        },
        showAnswer: function(me) {
            var op = me ? this.chooseMyOption : this.chooseHisOption,
                domlist   = document.querySelectorAll('.answer-list'),
                index     = this.transformABC(op),
                isright = this.judgeAnswer(op);
            if (me) {
                if (isright) {
                    this.isRight = true;
                    domlist[index].classList.add('option-right', 'my-right');
                } else {
                    domlist[index].classList.add('option-wrong', 'my-wrong');
                }
            } else {
                if (isright) {
                    domlist[index].classList.add('option-right', 'his-right');
                } else {
                    domlist[index].classList.add('option-wrong', 'his-wrong');
                }
            }

        },
        judgeAnswer: function(answer) {
            var str = '';
            if (answer == this.nowAnswer) {
                return true;
            } else  {
                return false;
            }
        }
    },
    watch: {

    },
    mounted: function() {
        // setTimeout(() => {
            ws = new WebSocket('ws://api.liejin99.com/wss?userid=465439760');
            ws.onopen = function() {
                // console.log(ws);
            };
            ws.onmessage = (e) => {
                console.log(e.data);
                var data = JSON.parse(e.data);

                if (data.status == 'matched') {
                    // 双方头像昵称开始即请求题目
                    document.querySelector('.question .start .ourside').addEventListener('webkitAnimationStart', () => {
                        console.log(this.playingShow);
                        ws.send(JSON.stringify({"op": "question"}));
                    })
                    document.querySelector('.question .start .ourside').addEventListener('webkitAnimationEnd', () => {
                        this.playingShow = true;
                    })
                    // 动画切换以及昵称头像的渲染
                    this.loadingShow = false;
                    this.startShow = true;
                    this.theirAvatar = data.data.avatar;
                    this.theirNickname = data.data.nickname;
                }
                if (data.status == 'sendQuestion') {
                    this.page ++;
                    this.questionInit();
                    console.log(this.isThree);
                    this.nowQuestion = data.data.question;
                    this.nowOptions = data.data.options;
                    this.isThree = Object.getOwnPropertyNames(this.nowOptions).length == 4 ? true : false;
                    console.log(this.isThree);
                    this.nowAnswer = data.data.answer;
                }
                // 对手操作
                if (data.status == 'matchReply') {
                    this.chooseHisOption = data.data.answer;
                    this.hisScores += data.data.score;
                    console.log(this.chooseMyOption, this.chooseMyOption == true);
                    if (this.chooseMyOption) {
                        console.log(222);
                        this.showAnswer();
                        this.sendMyAnswer();
                    }
                }
                // 答题成功，请求新题目
                if (data.status == 'answerSuccess') {
                    setTimeout(function() {
                        ws.send(JSON.stringify({"op": "question"}));
                    }, 2000)
                }

            };
            ws.onerror = function() {
                // console.log('发生错误');
            };
            ws.onclose = function() {
                console.log('已关闭');
            };
        // }, 1000);

    },
    watch: {

    },
    created: function() {

    }
});
