//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
// import layerCoin from './components/layerCoin.vue';
import Vue from 'vue/dist/vue.common.js';
// var Vue = require('vue');
var awards = new Vue({
    el: '.awards',
    data: {
        money: 0,
        userinfo: '',
        notEnough: 0,
        record: [],
        layerShow: false
    },
    components: {
    },
    methods: {
        play: function() {
            if (this.userinfo.coin <= 500) {
                this.layerShow = !this.layerShow;
                this.notEnough = 1;
            } else {
                window.location.href = './question.html';
            }
        },
        goCash: function() {
            this.layerShow = !this.layerShow;
            this.notEnough = 0;
        },
        renderName: function(awards) {
            switch (awards) {
                case 1:
                    return '解锁初出茅庐';
                case 2:
                    return '解锁小有名气';
                case 3:
                    return '解锁日进斗金';
                case 4:
                    return '解锁财大气粗';
                case 5:
                    return '解锁一掷千金';
                case 6:
                    return '解锁财富自由';
                case 7:
                    return '解锁家财万贯';
                case 8:
                    return '解锁独霸一方';
                case 9:
                    return '解锁金融大鳄';
                case 10:
                    return '解锁富可敌国';
                case 11:
                    return '解锁富甲天下';
                case 12:
                    return '解锁财富传说';
                case 13:
                    return '每周瓜分奖励';
                default:
                    break;
            }
        }
    },
    watch: {

    },
    mounted: function() {

    },
    computed: {

    },
    created: function() {
        console.log(1);
        $.ajax({
            type: 'GET',
            url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/userinfo/',
            dataType: 'jsonp',
            success: (data) => {
                if (data.errorcode == 0) {
                    // this.record = data.result;
                    this.userinfo = data.result;
                }
            }
        })
        $.ajax({
            type: 'GET',
            url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/awardlog/',
            dataType: 'jsonp',
            success: (data) => {
                if (data.errorcode == 0) {
                    // this.record = data.result;
                    this.record =  [
                        {
                            "award": 1,
                            "amount": 1,
                            "type": 1
                        },
                        {
                            "award": 7,
                            "amount": 2,
                            "type": 2
                        },
                        {
                            "award": 13,
                            "amount": 1,
                            "type": 2
                        }
                    ]
                    for (let i of this.record) {
                        this.money += i.amount;
                    }
                }
            }
        })
    }
});
