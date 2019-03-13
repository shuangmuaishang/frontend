<template>
<div>
    <div class="layer">
        <div class="tips">温馨提示</div>
        <p v-show="isenough">你的金币不够啦，你可以通过以下方式获得金币哦</p>
        <div class="invite">
            <img src="../images/homepage-add2.png">
        </div>
        <img class="gumin" src="../images/homepage-gumin.png">
        <img class="xiaohua" src="../images/homepage-xiaohua.png">
        <img class="login" src="../images/homepage-login.png">
    </div>
    <div v-show="coverneed" class="layer-cover"></div>
</div>
</template>

<script type="text/javascript">
export default {
    name: 'layerCoin',
    data() {
        return {

        }
    },
    props: ['isenough', 'coverneed'],
    methods: {

    },
    mounted: function() {

    },
    created: function() {
    }
};
</script>

<style type="text/css" scoped>
.layer {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 5.4rem;
    /*height: 6.26rem;*/
    background: #fff;
    border-radius: 0.2rem;
    -webkit-transform: translate(0, -50%);
            transform: translate(0, -50%);
    margin-left: -2.7rem;
    padding-bottom: 0.4rem;
    z-index: 11;
}

.layer-cover {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10;
}

.tips {
    width: 2.41rem;
    height: 0.62rem;
    line-height: 0.62rem;
    font-size: 0.28rem;
    color: #785083;
    background: #e8d4ee;
    border-radius: 0.3rem;
    margin-top: -0.3rem;
}

.layer p {
    width: 79%;
    font-size: 0.36rem;
    color: #333333;
    font-weight: bolder;
    margin-top: 0.2rem;
}

.invite {
    position: relative;
    width: 4.6rem;
    height: 1.10rem;
    background: url(../images/homepage-invite.png) center center;
    background-size: 100% 100%;
    margin-top: 0.4rem;
}

.invite > img {
    position: absolute;
    top: 50%;
    right: 0.1rem;
    margin-top: -0.45rem;
    width: 0.9rem;
    height: 0.91rem;
}

.layer > img {
    width: 4.6rem;
    height: 1.10rem;
    margin-top: 0.2rem;
}

.login {
    width: 4.6rem;
    height: 1.10rem;
    margin-top: 0.4rem;
}
</style>
