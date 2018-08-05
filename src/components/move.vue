<template>
    <div class="move">
        <div
            class="alert-box"
            v-show="showAlert"
        >
            <div class="hidden-box" ref="hidden-box">
                <transition name="slide-left">
                    <keep-alive>
                        <div 
                            class="move-box"
                            :id="isShow ? 'moveBox' : ''"
                            :style="{width:w+'px',height:h+'px'}"
                            @mousedown.prevent="boxStartFn"
                            @mousemove.prevent="boxMoveFn"
                            @mouseup.prevent="boxEndFn"
                            v-show="isShow"
                        >
                            <img 
                                :src="imgUrl" 
                                alt="" 
                                :style="{width:w+'px',height:h+'px',top:bt,left:bl,transform:`scale(${bigState})`}" 
                                class="image"
                            >
                            <canvas 
                                :id="isShow ? 'canvas' : ''" 
                                class="canvas"
                                width="1142"
                                height="356"
                                :style="{transform:`scale(${bigState})`}"
                                @mousedown.prevent="penStartFn"
                                @mousemove.prevent="penMoveFn"
                                @mouseup.prevent="penEndFn"
                            ></canvas>
                        </div>
                    </keep-alive>
                </transition>
                <transition name="slide-right">
                    <keep-alive>
                        <div 
                            class="move-box"
                            :id="!isShow ? 'moveBox' : ''"
                            :style="{width:w+'px',height:h+'px'}"
                            @mousedown.prevent="boxStartFn"
                            @mousemove.prevent="boxMoveFn"
                            @mouseup.prevent="boxEndFn"
                            v-show="!isShow"
                        >
                            <img 
                                :src="imgUrl2" 
                                alt="" 
                                :style="{width:w+'px',height:h+'px',top:bt,left:bl,transform:`scale(${bigState})`}" 
                                class="image"
                            >
                            <canvas 
                                :id="!isShow ? 'canvas' : ''" 
                                class="canvas"
                                width="1142"
                                height="356"
                                :style="{transform:`scale(${bigState})`}"
                                @mousedown.prevent="penStartFn"
                                @mousemove.prevent="penMoveFn"
                                @mouseup.prevent="penEndFn"
                            ></canvas>
                        </div>
                    </keep-alive>
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
export default{
    name : 'move',
    data(){
        return {
            isShow : true,//切换
            showAlert : 0,
            imgUrl : 'http://img.zcool.cn/community/0114375543f8ec0000019ae948310f.jpg',
            imgUrl2 : 'http://img.zcool.cn/community/014a52554064690000005b03d35d4e.jpg@2o.jpg',
            w : 1142,
            h : 356,
            /*缩放参数*/
            bw : 1142,
            bh : 356,
            bt : 0,
            bl : 0,
            bigState : 1,
            /*拖拽参数*/
            boxCx : 0,
            boxCy : 0,
            boxBaseState : false,
            banBoxMove : false,
            /*画笔参数*/
            penCx : 0,
            penCy : 0,
            penBaseState : false,
            banPenUse : true,
            penArr : [ '使用画笔' , '取消画笔'],
            cxt : '',
            stage_info : '',
            path : {
                beginX: 0,
                beginY: 0,
                endX: 0,
                endY: 0
            }
        }
    },
    created(){
        this.bw = 1142;
        this.bh = 356;
    },
    mounted(){
        this.cxt = canvas.getContext('2d');
    },
    methods : {
        chagneFn(){
            this.isShow = !this.isShow;
            this.cxt = canvas.getContext('2d')
        },
        /*     画笔    */
        banBoxMoveFn(){
            this.banBoxMove = !this.banBoxMove;
            this.banPenUse = !this.banBoxMove;
        },
        penStartFn(ev){
            if(this.banPenUse) return;
            this.penBaseState = true;
            window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
            this.stage_info = canvas.getBoundingClientRect();
            this.cxt.strokeStyle = "#000";
            this.cxt.beginPath();
            this.path.beginX = ev.clientX - this.stage_info.left;
            this.path.beginY = ev.clientY - this.stage_info.top;
            this.cxt.moveTo( this.path.beginX / this.bigState , this.path.beginY / this.bigState );
        },
        penMoveFn(ev){
            if(!this.penBaseState) return;
            this.path.endX = ev.clientX - this.stage_info.left;
            this.path.endY = ev.clientY - this.stage_info.top;
            this.cxt.lineTo( this.path.endX / this.bigState , this.path.endY / this.bigState );
            this.cxt.stroke();
        },
        penEndFn(ev){
            this.penBaseState = false;
        },
        clear(btn) {
            this.cxt.clearRect(0, 0, 1142, 356)
        },
        /*     拖拽    */
        boxStartFn(ev){
            if(this.banBoxMove) return;
            this.boxCx = ev.clientX - moveBox.offsetLeft;
            this.boxCy = ev.clientY - moveBox.offsetTop;
            this.boxBaseState = true;
        },
        boxMoveFn(ev){
            if(!this.boxBaseState) return;
            let left = ev.clientX - this.boxCx;
            let top = ev.clientY - this.boxCy;
            // if(top <= 0){
            //     top = 0;
            // }
            // if(top >= this.$refs['hidden-box'].offsetHeight){
            //     top = this.$refs['hidden-box'].offsetHeight;
            // }
            // if(left <= 0){
            //     left = 0;
            //     this.boxBaseState = false;
            // }
            // if(left >= this.$refs['hidden-box'].offsetWidth){
            //     left = this.$refs['hidden-box'].offsetWidth;
            // }
            moveBox.style.top = top + 'px';
            moveBox.style.left = left + 'px';
        },
        boxEndFn(ev){
            this.boxBaseState = false;
        },
        bigFn(){
            this.bigState = this.bigState + 1 == 4 ? 1 : this.bigState + 1;
            if(this.bigState == 1){
                moveBox.style.top = 0 + 'px';
                moveBox.style.left = 0 + 'px';
            }
        },
        closeFn(){
            this.showAlert = 0;
        },
        openFn(){
            this.showAlert = 1;
        }
    }
}
</script>
<style>
.btn-group{
    position : absolute;
    bottom : 0;
    right : 0;
}
.move-box{
    position : absolute;
    top : 0;
    left : 0;
}
.image{
    position: absolute;
    top : 0;
    left : 0;
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

.slide-right-enter-active{
    will-change: transform;
    transition: all 1s;
    position: absolute;
    left:100%;
}
.slide-left-enter-active{
    will-change: transform;
    transition: all 1s;
    position: absolute;
    left:100%;
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

