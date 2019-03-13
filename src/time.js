//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import layerCoin from './components/layerCoin.vue';
import Vue from 'vue/dist/vue.common.js';
Vue.config.devtools = true;
// var Vue = require('vue');
var time = new Vue({
    el: '.time',
    data: {
        day: 0,
        hour: '000',
        minute: '00',
        second: '00',
        timeShow: true,
        money: 0,
        userinfo: '',
        layerShow: false,
        notEnough: true
    },
    components: {

    },
    methods: {
        timeCount: function() {
            var timer = window.setInterval(function(){
                RefreshTime();
            },1000);

            function RefreshTime(targetDate){
                var Today = new Date();
                var leftSecond = 0;
                leftSecond = (23 - Today.getHours()) * 3600 + (59 - Today.getMinutes()) * 60 + (60 - Today.getSeconds()) + (5 - Today.getDay() - 1) * 24 * 3600 + 15.5 * 3600;
                // }
                console.log(leftSecond);
                if (Today.getDay() == 6 || Today.getDay() == 0 || leftSecond < 0) {
                    time.timeShow = false;
                    return;
                } else {
                    time.timeShow = true;
                }
                var Day = Math.floor(leftSecond / (60 * 60 * 24));
                var Hour = Math.floor((leftSecond - Day * 24 * 60 * 60) / 3600) ;
                var Minute = Math.floor((leftSecond - Day * 24 * 60 * 60 - Hour * 3600) / 60);
                var Second = Math.floor(leftSecond - Day * 24 * 60 * 60 - Hour * 3600 - Minute * 60);
                Hour = Hour + Day * 24;

                if (0 <= Hour && Hour <= 9) {
                    Hour = '00' + Hour;
                } else if (10 <= Hour && Hour <= 99) {
                    Hour = '0' + Hour;
                }

                if (0 <= Minute && Minute <= 9) {
                    Minute = '0' + Minute;
                }
                if (0 <= Second && Second <= 9) {
                    Second = '0' + Second;
                }

                time.day = Day;
                time.hour = Hour;
                time.minute = Minute;
                time.second = Second;

            }
        },
        play: function() {
            console.log(this.userinfo)
            if (this.userinfo.coin <= 5000) {
                this.layerShow = true;
                this.notEnough = 1;
            } else {
                window.location.href = './question.html';
            }
        },
        getMoney: function() {
            $.ajax({
                type: 'GET',
                url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/luckdraw/',
                dataType: 'jsonp',
                success: (data) => {
                    if (data.errorcode == 0) {
                        this.layerShow = true;
                        this.money = data.result;
                        // var a = 8;
                        // this.flag = a.toString(2);
                        // console.log(this.flag.split(''));
                    }
                }
            })
        }
    },
    watch: {

    },
    mounted: function() {
        this.timeCount();
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
                    console.log(this.userinfo);
                    // var a = 8;
                    // this.flag = a.toString(2);
                    // console.log(this.flag.split(''));
                }
            }
        })
    }
});
