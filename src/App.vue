<template>
  <div id="app">
    <button id="toggle" @click="toggleCropper">Toggle Cropper</button>
    <div class="fa" ref="fa">
      <div class="bor">
        <img
          id="image"
          v-show="showCropper"
          v-cropper="cropOptions"
          :src="imgSrcUrl"
          alt="Mustache"
          style="width : 1142px; height : 356px;"
        >
      </div>
        <!-- <canvas id="canvas" width="1142" height="356" style="border:1px solid black">Canvas画板</canvas> -->
    </div>
    <button type="" v-on:click="clear">清除</button>
    <button v-on:click="save">保存</button>
    <input id="zoomable" type="checkbox" v-model="cropOptions.zoomable">
    <label for="zoomable">Zoomable?</label>
    <input type="button" :value="'放大' + bigState" @click="toBigFn">
    <input type="button" value="拖拽" @click="changeMoveState">
    <input type="button" :value="penArr[penState]" @click="changePen">
  </div>
</template>

<script>
import jQuery from 'jquery'
import 'cropper'

var draw;
var preHandler = function(e){e.preventDefault();}


export default {
  directives: {
    cropper : {
      deep: true,
      bind (el, binding, vnode) {
        jQuery(el).cropper({
          background : false,
          dragCrop : false,
          mouseWheelZoom : false,
          aspectRatio: 0 / 1,
          viewMode : 0,
          dragMode  : 'move',
          modal : false,
          zoomOnWheel : false,
          minContainerWidth : 1142,
          minContainerHeight : 356,
          toggleDragModeOnDblclick : false,
          ready:function () {
            jQuery(el).cropper('clear')
          },
        })
      },
      update (el) {
        // setTimeout(() => {
        //   jQuery(image).cropper(el)
        // }, 0)
      },
      unbind () {
        jQuery(image).cropper('destroy')
      }
    }
  },

  data () {
    return {
      imgSrcUrl : 'http://img.zcool.cn/community/0114375543f8ec0000019ae948310f.jpg',
      cropOptions: {
        viewMode: 0,
        zoomable: false,
      },
      showCropper: false,
      bigState : 1,
      moveState : true,

      msg: 'Welcome to Your Vue.js App',
      val:true,
      url:"",
      draw : '',
      penArr : ['取消画笔' , '使用画笔'],
      penState : 1,
    }
  },
  mounted(){
    jQuery(image).cropper('getCroppedCanvas',{
      width : 1142,
      height : 356
    })
    var canvasData = document.createElement('canvas');
    canvasData.width = '1142';
    canvasData.height = '356';
    console.log(this.$refs.fa.childNodes[0].childNodes[1])
    // $('.cropper-canvas').append($('#canvas'))

    // class Draw {
    //   constructor(el) {
    //     this.el = el
    //     // this.canvas = document.getElementById(this.el)
    //     this.canvas = document.getElementById('canvas')
    //     this.cxt = this.canvas.getContext('2d')
    //     this.stage_info = canvas.getBoundingClientRect()
    //     this.path = {
    //       beginX: 0,
    //       beginY: 0,
    //       endX: 0,
    //       endY: 0
    //     }
    //   }
    //   init(btn) {
    //     var that = this; 
        
    //     this.canvas.onmousedown = function(event) {
    //       document.addEventListener('mousedown', preHandler, false); 
    //       that.drawBegin(event)
    //     }
    //     this.canvas.onmouseup = function(event) { 
    //       document.addEventListener('mouseup', preHandler, false); 
    //       that.drawEnd()
          
    //     }
    //     // this.clear(btn)
    //   }
    //   clean(){
    //     document.removeEventListener('mousedown', preHandler, false); 
    //     document.removeEventListener('mouseup', preHandler, false);
    //     document.removeEventListener('mousemove', preHandler, false);
    //     this.canvas.onmousemove = null;
    //     this.canvas.onmouseup = null;
    //     this.canvas.onmousedown = null;
    //   }
    //   drawBegin(e) {
    //     var that = this;
    //     window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
    //     this.cxt.strokeStyle = "#000"
    //     this.cxt.beginPath()
    //     console.log(e,this.stage_info)
    //     this.cxt.moveTo(
    //       e.clientX - this.stage_info.left,
    //       e.clientY - this.stage_info.top
    //     )
    //     this.path.beginX = e.clientX - this.stage_info.left
    //     this.path.beginY = e.clientY - this.stage_info.top
    //     this.canvas.onmousemove = function(){
    //       that.drawing(event)
    //     }
    //   }
    //   drawing(e) {
    //     this.cxt.lineTo(
    //       e.clientX - this.stage_info.left,
    //       e.clientY - this.stage_info.top
    //     )
    //     this.path.endX = e.clientX - this.stage_info.left
    //     this.path.endY = e.clientY - this.stage_info.top
    //     this.cxt.stroke()
    //   }
    //   drawEnd() {
    //     var that = this;
    //     this.clean();
    //     var timer = setTimeout(function(){
    //       that.canvas.onmousedown = function(event) {
    //         document.addEventListener('mousedown', preHandler, false); 
    //         that.drawBegin(event);
    //         clearTimeout(timer);
    //       }
    //     },200);
    //   }
    //   clear(btn) {
    //     this.cxt.clearRect(0, 0, 1142, 356)
    //   }
    //   save(){
    //     return canvas.toDataURL("image/png")
    //   }
    // }
    
    // this.draw=new Draw('canvas');
  },
  methods: {
    changePen(){
      if(this.penState){
        this.draw.init();
        this.penState = 0;
      }else{
        this.draw.clean();
        this.penState = 1;
      }
    },
    toggleCropper () {
      this.showCropper = !this.showCropper
    },
    toBigFn(){
      console.log(jQuery(image).cropper('getCroppedCanvas',{
        width : 1142,
        height : 356
      }))
      this.bigState = this.bigState + 1 == 4 ? 1 : this.bigState + 1;
      if(this.bigState == 1){
        jQuery(image).cropper('zoom',-3);
        jQuery(image).cropper('setCanvasData',{
          left : 0,
          top : 0
        })
      }else{
        jQuery(image).cropper('zoom',1);
      }
    },
    changeMoveState(){
      console.log($(image).cropper('getCroppedCanvas'))
      if(this.moveState){
        jQuery(image).cropper('setDragMode',{
          mode : 'crop'
        });
      }else{
        jQuery(image).cropper('setDragMode','move');
      }
      this.moveState = !this.moveState;
    },
    clear:function(){
      draw.clear();
    },
    save:function(){
      var data=draw.save();
      this.url = data;
      console.log(data)
    },
    mutate(word){
      this.$emit("input", word);
    },
  }
}
</script>

<style>
.fa{
  width : 1142px;
  height : 356px;
  position: relative;
}
#app {
  width : 100%;
  height : 100%;
}
#canvas{
  /* position: absolute;
  top : 0;
  left : 0;
  z-index : 1; */
}
.bor{
  width : 1142px;
  height : 356px;
  border : 1px solid #ccc;
  position: absolute;
  top : 0;
  left : 0;
}
h1, h2 {
 font-weight: normal;
}
ul {
 list-style-type: none;
 padding: 0;
}
li {
 display: inline-block;
 margin: 0 10px;
}
a {
 color: #42b983;
}
#canvas {
 background: rgba(0,0,0,0);
 cursor: default;
}
#keyword-box {
 margin: 10px 0;
}
</style>
