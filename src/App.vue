<template>
  <div id="app">
    <button id="toggle" @click="toggleCropper">Toggle Cropper</button>
    <img
      id="image"
      v-show="showCropper"
      v-cropper="cropOptions"
      :src="imgSrcUrl"
      alt="Mustache"
      style="width : 1142px; height : 356px;"
    >
    <input id="zoomable" type="checkbox" v-model="cropOptions.zoomable">
    <label for="zoomable">Zoomable?</label>
    <input type="button" :value="'放大' + bigState" @click="toBigFn">
    <input type="button" value="拖拽" @click="changeMoveState">
  </div>
</template>

<script>
import jQuery from 'jquery'
import 'cropper'

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
    }
  },
  mounted(){
    jQuery(image).cropper('getCroppedCanvas',{
      width : 1142,
      height : 356
    })
  },
  methods: {
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
    }
  }
}
</script>

<style>
#app {
  width : 100%;
  height : 100%;
}
</style>
