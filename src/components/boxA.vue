<template>
    <div class="hidden-box" ref="hidden-box-a">
        <div 
            class="move-box"
            id="moveBoxA"
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
                id="canvasA" 
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
        this.cxt = canvasA.getContext('2d');
    },
    methods : {
        /*     画笔    */
        penStartFn(ev){
            if(this.banPenUse) return;
            this.penBaseState = true;
            window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
            this.stage_info = canvasA.getBoundingClientRect();
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
            //图片小于显示框，禁止拖拽
            if(
                moveBoxA.offsetHeight * this.bigState <= this.$refs['hidden-box-a'].offsetHeight
                && moveBoxA.offsetWidth * this.bigState <= this.$refs['hidden-box-a'].offsetWidth
            ){
                return;
            }
            if(this.banBoxMove) return;
            this.boxCx = ev.clientX - moveBoxA.offsetLeft;
            this.boxCy = ev.clientY - moveBoxA.offsetTop;
            this.boxBaseState = true;
        },
        boxMoveFn(ev){
            if(!this.boxBaseState) return;
            let left = ev.clientX - this.boxCx;
            let top = ev.clientY - this.boxCy;
            //边界限制-->1.图片宽高超出显示框   2.图片宽或高超出显示框
            if(this.$refs['hidden-box-a'].offsetHeight > moveBoxA.offsetHeight * this.bigState){
                //图片高小于显示框高，禁止拖拽
                // console.log(top , this.bigState - 1 ,)
                if(top - ( this.bigState - 1 ) * this.$refs['hidden-box-a'].offsetHeight / 2 >= 0){
                    top = ( this.bigState - 1 ) * this.$refs['hidden-box-a'].offsetHeight / 2;
                }
            }else{
                //1.图片底部不能超出显示框底部  
                if(top * this.bigState <= this.$refs['hidden-box-a'].offsetHeight - moveBoxA.offsetHeight * this.bigState){
                    top = (this.$refs['hidden-box-a'].offsetHeight - moveBoxA.offsetHeight * this.bigState) / this.bigState;
                    console.log('dfdcccccc')
                }
                //2.图片顶部不能低于显示框顶部
                if(top >= moveBoxA.offsetHeight * this.bigState - this.$refs['hidden-box-a'].offsetHeight){
                    console.log('dfdcccccc1231321')
                    top = (moveBoxA.offsetHeight * this.bigState - this.$refs['hidden-box-a'].offsetHeight);
                }
            }

            if(this.$refs['hidden-box-a'].offsetWidth > moveBoxA.offsetWidth * this.bigState){
                //图片高小于显示框宽，禁止拖拽
                left = 0;
            }else{
                //3.图片左侧不能大于显示框左侧 
                if(
                    this.$refs['hidden-box-a'].offsetWidth <= moveBoxA.offsetWidth * this.bigState &&
                    left >= moveBoxA.offsetWidth * this.bigState - this.$refs['hidden-box-a'].offsetWidth
                ){
                    left = (moveBoxA.offsetWidth * this.bigState - this.$refs['hidden-box-a'].offsetWidth) / this.bigState;
                }
                //4.图片右侧不能小于显示框右侧
                if(
                    this.$refs['hidden-box-a'].offsetWidth <= moveBoxA.offsetWidth * this.bigState &&
                    left * this.bigState <= this.$refs['hidden-box-a'].offsetWidth - moveBoxA.offsetWidth * this.bigState
                ){
                    left = (this.$refs['hidden-box-a'].offsetWidth - moveBoxA.offsetWidth * this.bigState) / this.bigState;
                }
            } 
            //鼠标限制
            //1.鼠标超出显示范围    
            let minX = this.offLeft - this.$refs['hidden-box-a'].offsetWidth / 2;
            let maxX = this.offLeft + this.$refs['hidden-box-a'].offsetWidth / 2;
            let minY = this.offTop - this.$refs['hidden-box-a'].offsetHeight / 2;
            let maxY = this.offTop + this.$refs['hidden-box-a'].offsetHeight / 2;
            if(
                ev.clientX <= minX + 10
                || ev.clientX >= maxX - 10
                || ev.clientY <= minY + 10
                || ev.clientY >= maxY - 10
            ){
                this.boxBaseState = false;
                return;
            }
            //2.鼠标超出图片范围
            if(
                ev.clientY >= top - 50 + minY + moveBoxA.offsetHeight
                || ev.clientY <= top + 50 + minY
                || ev.clientX <= left + 50 + minX
                || ev.clientX >= left - 50 + minX + moveBoxA.offsetWidth
            ){
                this.boxBaseState = false;
                return;
            }
            moveBoxA.style.top = top + 'px';
            moveBoxA.style.left = left + 'px';
        },
        boxEndFn(ev){
            this.boxBaseState = false;
        },
        bigFn(){
            this.bigState = this.bigState + 1 == 4 ? 1 : this.bigState + 1;
            if(this.bigState == 1){
                moveBoxA.style.top = 0 + 'px';
                moveBoxA.style.left = 0 + 'px';
            }
            this.changeBigStateFn();
        },
        changeBigStateFn(){
            this.$emit('emitBigStateFn' , this.bigState);
        }
    }
}
</script>
<style scoped>
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
.hidden-box{
    width : 100%;
    height : 100%;
    position: absolute;
    top : 50%;
    left : 50%;
    transform: translate(-50% , -50%);
    background : #fff;
    z-index: 1;
    overflow: hidden;
}
</style>

