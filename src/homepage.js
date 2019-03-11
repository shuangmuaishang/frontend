//@charset "utf-8";
// var mBasic = require('@ths/mbasic');
import Vue from 'vue/dist/vue.common.js';
// var Vue = require('vue');
var question = new Vue({
    el: '.homepage',
    data: {
        avatar: '',
        userinfo: '',
        layerShow: 0,
        notEnough: 0,
    },
    components: {

    },
    methods: {
        jumpTo: function(des) {
            switch (des) {
                case 0:
                    window.location.href = './awards.html';
                    break;
                case 1:
                    window.location.href = './time.html';
                    break;
                case 2:
                    window.location.href = './gift.html';
                    break;
                case 3:
                    window.location.href = './rank.html';
                    break;
                case 4:
                    window.location.href = './rule.html';
                    break;
                case 5:
                    // if (this.userinfo.coin <= 80 + 20 * this.userinfo.level) {
                    if (this.userinfo.coin <= 500) {
                        this.layerShow = !this.layerShow;
                        this.notEnough = 1;
                    } else {
                        window.location.href = './question.html';
                    }
                    break;
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
        $.ajax({
            type: 'GET',
            url: '//testm.10jqka.com.cn/mobile/info/cmt/ljapi/activity/answer/userinfo/',
            dataType: 'jsonp',
            success: (data) => {
                if (data.errorcode == 0) {
                    this.userinfo = data.result;
                }
            }
        })
    }
});
