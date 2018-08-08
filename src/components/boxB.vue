<template>
    <div class="move">
        <div class="hidden-box" ref="hidden-box-b">
            <div 
                class="move-box"
                id="moveBoxB"
                :style="{width:w+'px',height:h+'px'}"
                @mousedown.prevent="boxStartFn"
                @mousemove.prevent="boxMoveFn"
                @mouseup.prevent="boxEndFn"
            >
                <img 
                    :src="imgUrl" 
                    alt="" 
                    :style="{width:w+'px',height:h+'px',top:bt,left:bl,transform:`scale(${bigState})`}" 
                    class="image"
                >
                <canvas 
                    id="canvasB" 
                    class="canvas"
                    width="1142"
                    height="356"
                    :style="{transform:`scale(${bigState})`}"
                    @mousedown.prevent="penStartFn"
                    @mousemove.prevent="penMoveFn"
                    @mouseup.prevent="penEndFn"
                ></canvas>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    name : 'boxA',
    data(){
        return {
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
            /*画笔参数*/
            penCx : 0,
            penCy : 0,
            penBaseState : false,
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
    props : {
        banBoxMove : {
            type : Boolean,
            default : true
        },
        banPenUse : {
            type : Boolean,
            default : false
        },
        imgUrl : {
            type : String,
            default : ''
        },
        offLeft : {
            type : Number,
            default : 0
        },
        offTop : {
            type : Number,
            default : 0
        }
    },
    created(){
        this.bw = 1142;
        this.bh = 356;
    },
    mounted(){
        this.cxt = canvasB.getContext('2d');
    },
    methods : {
        /*     画笔    */
        penStartFn(ev){
            if(this.banPenUse) return;
            this.penBaseState = true;
            window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
            this.stage_info = canvasB.getBoundingClientRect();
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
        clear() {
            this.cxt.clearRect(0, 0, 1142, 356)
        },
        /*     拖拽    */
        boxStartFn(ev){
            if(this.banBoxMove) return;
            this.boxCx = ev.clientX - moveBoxB.offsetLeft;
            this.boxCy = ev.clientY - moveBoxB.offsetTop;
            this.boxBaseState = true;
        },
        boxMoveFn(ev){
            if(!this.boxBaseState) return;
            let left = ev.clientX - this.boxCx;
            let top = ev.clientY - this.boxCy;
            // if(top <= 0){
            //     top = 0;
            // }
            // if(top >= this.$refs['hidden-box-b'].offsetHeight){
            //     top = this.$refs['hidden-box-b'].offsetHeight;
            // }
            // if(left <= 0){
            //     left = 0;
            //     this.boxBaseState = false;
            // }
            // if(left >= this.$refs['hidden-box-b'].offsetWidth){
            //     left = this.$refs['hidden-box-b'].offsetWidth;
            // }
            moveBoxB.style.top = top + 'px';
            moveBoxB.style.left = left + 'px';
        },
        boxEndFn(ev){
            this.boxBaseState = false;
        },
        bigFn(){
            this.bigState = this.bigState + 1 == 4 ? 1 : this.bigState + 1;
            if(this.bigState == 1){
                moveBoxB.style.top = 0 + 'px';
                moveBoxB.style.left = 0 + 'px';
            }
            this.changeBigStateFn();
        },
        changeBigStateFn(){
            this.$emit('emitBigStateFn' , this.bigState);
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
    overflow: hidden;
}
.hidden-box-div{
    width : 100%;
    height : 100%;
    position : relative;
    overflow: hidden;
}
</style>

