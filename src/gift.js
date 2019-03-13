//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import layerCoin from './components/layerCoin.vue';
import Vue from 'vue/dist/vue.common.js';
Vue.config.devtools = true;
// var Vue = require('vue');
var gift = new Vue({
    el: '.gift',
    data: {
        money: 0,
        userinfo: {
            level: 3
        },
        notEnough: 0,
        flag: 0,

        gift: 3,
        nowAward: 0,

        layerShow: false,
        list: [{
            name: '初出茅庐',
            award: '2.58元现金红包',
            status: 0,
            value: 2.58
        }, {
            name: '小有名气',
            award: '猎金大礼包',
            status: 0
        }, {
            name: '日进斗金',
            award: '5%答题金币加成',
            status: 0
        }, {
            name: '财大气粗',
            award: '1.28元现金红包',
            status: 0,
            value: 1.28
        }, {
            name: '一掷千金',
            award: '开户大礼包',
            status: 0
        }, {
            name: '财富自由',
            award: '5%答题金币加成',
            status: 0
        }, {
            name: '家财万贯',
            award: '0.88元现金红包',
            status: 0,
            value: 0.88
        }, {
            name: '独霸一方',
            award: '奖励：基金大礼包',
            status: 0
        }, {
            name: '金融大鳄',
            award: '5%答题金币加成',
            status: 0
        }, {
            name: '富可敌国',
            award: '0.66元现金红包',
            status: 0,
            value: 0.66
        }, {
            name: '富甲天下',
            award: '港美股大礼包',
            status: 0
        }, {
            name: '财富传说',
            award: '5%答题金币加成',
            status: 0
        }]
    },
    components: {
        'layer-coin': layerCoin
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
        // 领取已领取状态
        getGift: function(e, index) {
            $.ajax({
                type: 'GET',
                url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/award/',
                data: {
                    award: index + 1
                },
                dataType: 'jsonp',
                success: (data) => {
                    if (data.errorcode == 0) {
                        this.list[index].status = 1;
                        this.layerShow = true;
                        if (index == 0 || index == 3 || index == 6 || index == 9) {
                            this.gift = 1;
                            this.nowAward = this.list[index].value;
                        } else if (index == 1 || index == 4 || index == 7 || index == 10) {
                            this.gift = 2;
                            this.nowAward = this.list[index].award;
                        } else if (index == 2 || index == 5 || index == 8 || index == 11) {
                            this.gift = 3;
                            this.nowAward = this.list[index].award;
                        }
                    }
                }
            })
        }

    },
    watch: {

    },
    mounted: function() {

    },
    computed: {

    },
    created: function() {
        $.ajax({
            type: 'GET',
            url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/userinfo/',
            dataType: 'jsonp',
            success: (data) => {
                if (data.errorcode == 0) {
                    this.userinfo = data.result;
                    // var a = 8;
                    // this.flag = a.toString(2);
                    // console.log(this.flag.split(''));
                }
            }
        })
        $.ajax({
            type: 'GET',
            url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/awardlog/',
            dataType: 'jsonp',
            success: (data) => {
                if (data.errorcode == 0) {
                    this.record = data.result;
                    // this.record =  [
                    //     {
                    //         "award": 1,
                    //         "amount": 1,
                    //         "type": 1
                    //     }
                    // ]
                    for (let i = 0; i < this.record.length; i++) {
                        if (this.record[i].award >= 13) {
                            continue;
                        }
                        this.list[this.record[i].award - 1].status = 1;
                    }

                }
            }
        })

    }
});
