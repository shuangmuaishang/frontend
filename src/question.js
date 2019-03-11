//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import Vue from 'vue/dist/vue.common.js';
// var Vue = require('vue');
var ws;
var question = new Vue({
    el: '.question',
    data: {
        messageList: ['厉害厉害', '666', '很精彩', '是我输了', '不服不行', '再来一局'],
        // 三种动画状态
        loadingShow: true,
        startShow: false,
        playingShow: false,
        resultShow: false,

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
        time: 10,
        timer: '',

        countStop: 0,

        myRightnum: 0,
        hisnumCache: 0,
        hisRightnum: 0,
        myScores: 0,
        hisScores: 0,

        myMessage: '',
        hisMessage: '',

        finally: {
            "win": 0,
            "userinfo": {
                "nickname": "",
                "avatar": "",
                "coin": 0,
                "level": 0,
                "star": 0,
                "play": 0,
                "win": 0,
                "week": 0,
                "award_flag": 0
            }
        },
        finallyImg: '',
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
        message: function(e, $index) {
            this.myMessage = this.messageList[$index];
            setTimeout(() => {
                this.myMessage = '';
            }, 2000);
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
            this.time = 10;
            // this.countStop = 1;
            this.countStop = 0;


            var btnlist = document.querySelectorAll('.answer-list');
            btnlist.forEach(function(el, index) {
                el.classList.remove('option-right', 'option-wrong', 'my-right', 'his-right', 'my-wrong', 'his-wrong');
            })


            // 倒计时动画清空
            this.$refs.an1.classList.remove('leftcountdown');
            this.$refs.an2.classList.remove('rightcountdown');
            setTimeout(() => {
                this.$refs.an1.classList.add('leftcountdown');
            }, 100);
            setTimeout(() => {
                this.$refs.an2.classList.add('rightcountdown');
            }, 100);
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
        timeCount: function() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.time == 0.5) {
                    this.countStop = 1;
                    this.time = 0.4;
                    // 时间到了如果我还没选，强制公布答案
                    this.showAnswer();
                    this.sendMyAnswer(1);
                    // clearInterval(timer);
                } else if (0 < this.time && this.time < 0.5){
                    this.time -= 0.1;
                } else {
                    this.time -= 0.5;
                }
            }, 500);
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
                // this.countStop = 1;
            }
        },
        sendMyAnswer: function(notime) {
            if (notime) {
                ws.send(JSON.stringify({
                    "op": "answer",
                    "data": {
                        "answer": '',
                        "right": '',
                        "score": 0
                    }
                }));
            } else {
                ws.send(JSON.stringify({
                    "op": "answer",
                    "data": {
                        "answer": this.chooseMyOption,
                        "right": Number(this.isRight),
                        "score": this.myScores
                    }
                }));
            }
        },
        showAnswer: function(me) {
            var op = me ? this.chooseMyOption : this.chooseHisOption,
                domlist   = document.querySelectorAll('.answer-list'),
                index     = this.transformABC(op),
                isright = this.judgeAnswer(op);
            if (me) {
                if (isright) {
                    this.isRight = true;
                    this.myScores += this.time * 20;
                    this.myRightnum += 1;
                    domlist[index].classList.add('option-right', 'my-right');
                } else {
                    domlist[index].classList.add('option-wrong', 'my-wrong');
                }
            } else {
                if (isright) {
                    this.hisRightnum = this.hisnumCache;
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
                        ws.send(JSON.stringify({"op": "question"}));
                    })
                    document.querySelector('.question .start .ourside').addEventListener('webkitAnimationEnd', () => {
                        this.playingShow = true;
                        this.timeCount();
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
                    this.nowQuestion = data.data.question;
                    this.nowOptions = data.data.options;
                    this.isThree = Object.getOwnPropertyNames(this.nowOptions).length == 4 ? true : false;
                    this.nowAnswer = data.data.answer;

                }
                // 对手操作
                if (data.status == 'matchReply') {
                    this.chooseHisOption = data.data.answer;
                    this.hisScores += data.data.score;
                    this.hisnumCache += data.data.right;
                    console.log(this.chooseMyOption, this.chooseMyOption == true);
                    if (this.chooseMyOption) {
                        this.showAnswer();
                        this.sendMyAnswer();
                    }
                    console.log(this.hisnumCache);
                }
                // 可敬的对手，打得不错
                if (data.status == 'interaction') {
                    this.hisMessage = this.messageList[data.data.type - 1];
                    setTimeout(() => {
                        this.hisMessage = '';
                    }, 2000);
                }
                // 答题成功，请求新题目
                if (data.status == 'answerSuccess') {
                    setTimeout(function() {
                        ws.send(JSON.stringify({"op": "question"}));
                    }, 2000)
                }
                // 没题目了
                if (data.status == 'noQuestion') {
                    ws.send(JSON.stringify({"op": "balance"}));
                }
                // 最终结算
                if (data.status == 'balanceSuccess') {
                    this.resultShow = true;
                    this.finally = data.data;

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
    computed: {
        renderName: function() {
            switch (this.finally.userinfo.level) {
                case 1:
                    return '初出茅庐';
                case 2:
                    return '小有名气';
                case 3:
                    return '日进斗金';
                case 4:
                    return '财大气粗';
                case 5:
                    return '一掷千金';
                case 6:
                    return '财富自由';
                case 7:
                    return '家财万贯';
                case 8:
                    return '独霸一方';
                case 9:
                    return '金融大鳄';
                case 10:
                    return '富可敌国';
                case 11:
                    return '富甲天下';
                case 12:
                    return '财富传说';
            }
        }
    },
    watch: {
        finally: {

        }
    },
    created: function() {

    }
});
