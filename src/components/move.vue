<template>
    <div class="move">
        <div
            class="alert-box"
            v-if="showAlert"
        >
            <div class="hidden-box" ref="hidden-box">
                <transition name="slide-left">
                    <div 
                        class="fa-box"
                        v-show="isShow"
                    >
                        <box-a
                            :banBoxMove="banBoxMove"
                            :banPenUse="banPenUse"
                            :imgUrl="imgUrl1"
                            :offLeft="offLeft"
                            :offTop="offTop"
                            @emitBigStateFn="emitBigStateFn"
                            ref="boxA"
                        ></box-a>
                    </div>
                </transition>
                <transition name="slide-right">
                    <div 
                        class="fa-box"
                        v-show="!isShow"
                    >
                        <box-b
                            :banBoxMove="banBoxMove"
                            :banPenUse="banPenUse"
                            :imgUrl="imgUrl2"
                            @emitBigStateFn="emitBigStateFn"
                            :offLeft="offLeft"
                            :offTop="offTop"
                            ref="boxB"
                        ></box-b>
                    </div>
                </transition>
                <div class="btn-group">
                    <input type="button" :value="'放大' + bigState" @click="bigFn">
                    <input type="button" :value="banPenUse ? penArr[0] : penArr[1]" @click="banBoxMoveFn">
                    <input type="button" value="清除画布" @click="clear">
                    <input type="button" value="切换" @click="chagneFn">
                </div>
            </div>
            <div class="hidden-bg"  @click.stop="closeFn"></div>
        </div>
        <input type="button" value="打开" @click="openFn">
    </div>
</template>
<script>
import BoxA from './boxA'
import BoxB from './boxB'

export default{
    name : 'move',
    data(){
        return {
            isShow : true,//切换
            showAlert : 0,
            imgUrl1 : 'http://img.zcool.cn/community/0114375543f8ec0000019ae948310f.jpg',
            imgUrl2 : 'http://img.zcool.cn/community/014a52554064690000005b03d35d4e.jpg@2o.jpg',
            bigState : 1,
            /*拖拽参数*/
            boxBaseState : false,
            banBoxMove : false,
            /*画笔参数*/
            penBaseState : false,
            banPenUse : true,
            penArr : [ '使用画笔' , '取消画笔'],
            offLeft : 0,
            offTop : 0
        }
    },
    components : {
        BoxA,
        BoxB
    },
    created(){
        this.bw = 1142;
        this.bh = 356;
    },
    methods : {
        /*     切换    */
        chagneFn(){
            this.banPenUse = true;
            this.banBoxMove = false;
            this.isShow = !this.isShow;
            this.changeBigStateShowFn();
        },
        /*     缩放    */
        bigFn(){
            if(this.isShow){
                //显示A
                this.$refs.boxA.bigFn();
            }else{
                //显示B
                this.$refs.boxB.bigFn();
            }
        },
        changeBigStateShowFn(){
            if(this.isShow){
                //显示boxA
                this.$refs.boxA.changeBigStateFn();
            }else{
                //显示boxB
                this.$refs.boxB.changeBigStateFn();
            }
        },
        emitBigStateFn(value){
            this.bigState = value;
        },
        /*     画笔    */
        banBoxMoveFn(){
            this.banBoxMove = !this.banBoxMove;
            this.banPenUse = !this.banBoxMove;
        },
        clear(){
            if(this.isShow){
                //显示boxA
                this.$refs.boxA.clear();
            }else{
                //显示boxB
                this.$refs.boxB.clear();
            }
        },
        /*     显隐    */
        closeFn(){
            this.showAlert = 0;
        },
        openFn(){
            this.showAlert = 1;
            this.$nextTick(() => {
                this.offLeft = this.$refs['hidden-box'].offsetLeft;
                this.offTop = this.$refs['hidden-box'].offsetTop;
            })
        },
        
    }
}
</script>
<style>
.fa-box{
    position : absolute;
    top : 0;
    left : 0;
    width : 100%;
    height : 100%;
}

.btn-group{
    position : absolute;
    bottom : 0;
    right : 0;
    z-index: 2;
}

.move{
    width : 100%;
    height : 100%;
    position: relative;
}
.alert-box{
    width : 98%;
    height : 98%;
    position: fixed;
    top : 0;
    left : 0;
    background : rgba(0,0,0,0.5);
}
.hidden-box{
    width : 90%;
    height : 90%;
    position: absolute;
    top : 50%;
    left : 50%;
    transform: translate(-50% , -50%);
    background : #fff;
    z-index: 1;
    /* overflow: hidden; */
}
.hidden-box-div{
    width : 100%;
    height : 100%;
    position : relative;
    /* overflow: hidden; */
}

.slide-right-enter-active{
    will-change: transform;
    transition: all 1s;
    position: absolute;
    left:0;
}
.slide-left-enter-active{
    will-change: transform;
    transition: all 1s;
    position: absolute;
    left:0;
}
.slide-right-leave-active{
    will-change : transform;
    transition: all 1s;
    position: absolute;
    left : 0;
}
.slide-left-leave-active{
    will-change : transform;
    transition: all 1s;
    position: absolute;
    left:-100%;
}
.slide-right-enter {
    transform: translateX(100%);
}
.slide-right-leave-active {
    transform: translateX(100%);
}
.slide-left-enter {
    transform: translateX(-100%);
}
.slide-left-leave-active {
    transform: translateX(-100%);
}

.hidden-bg{
    width: 100%;
    height : 100%;
    position: absolute;
    top : 0;
    left : 0;
}
</style>

