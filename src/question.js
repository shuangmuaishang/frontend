//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import Vue from 'vue/dist/vue.common.js';
// var Vue = require('vue');
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
        threeQuestion: true,

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
            var answer = e.target.getAttribute('data-answer');
            e.target.classList.add(this.judgeAnswer(answer));
            this.chooseMyOption = true;
            if (this.chooseHisOption) {
                document.querySelectorAll('.answer-list')[this.transformABC(this.chooseHisOption)].classList.add(this.judgeAnswer(this.chooseHisOption));
            }
        },
        judgeAnswer: function(answer) {
            var str = '';
            if (answer == this.nowAnswer) {
                str = 'option-right, right';
            } else  {
                str = 'option-wrong, wrong';
            }
            return str;
        }
    },
    watch: {

    },
    mounted: function() {
        setTimeout(() => {
            console.log(question);
            var ws = new WebSocket('ws://api.liejin99.com/wss?userid=465439760');
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
                        console.log(1);
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
                    // this.questionList = data.data;
                    this.nowQuestion = data.data.question;
                    this.nowOptions = data.data.options;
                    this.threeQuestion = Object.getOwnPropertyNames(this.nowOptions).length == 4 ? true : false;
                    console.log(Object.getOwnPropertyNames(this.nowOptions), Object.getOwnPropertyNames(this.nowOptions).length);
                    this.nowAnswer = data.data.answer;
                }
                // 对手操作
                if (data.status == 'matchReply') {
                    this.chooseHisOption = data.data.answer;
                    this.hisScores = data.data.score;
                    if (this.chooseMyOption == true) {
                        document.querySelectorAll('.answer-list')[this.transformABC(this.chooseHisOption)].classList.add(this.judgeAnswer(this.chooseHisOption));
                    }
                }

            };
            ws.onerror = function() {
                // console.log('发生错误');
            };
            ws.onclose = function() {
                console.log('已关闭');
            };
        }, 1000);

    },
    watch: {

    },
    created: function() {

    }
});
