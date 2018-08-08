<template>
    <div class="trans-box">
        <div class="fa-box" v-ccc="obj">
            <transition name="slide-left">
                <div class="box" v-show="isShow">1</div>
            </transition>
            <transition name="slide-right">
                <div class="box1" v-show="!isShow">2</div>
            </transition>
        </div>
    <input type="button" value="切换" @click="chagneFn">
    </div>
</template>
<script>
export default{
    name : 'TransitionBox',
    directives : {
        ccc : {
            bind(el,binding){
                console.log(el)
                console.log(this)
                console.log(binding.value)
            }
        }
    },
    data(){
        return {
            isShow : true,
            obj : {
                a : 1,
                b : 2
            }
        }
    },
    methods : {
        chagneFn(){
            this.isShow = !this.isShow;
        }
    }
}
</script>
<style scoped>
.slide-right-enter-active{
    will-change: transform;
    transition: all .3s;
    position: absolute;
    left:302px;
}
.slide-left-enter-active{
    will-change: transform;
    transition: all .3s;
    position: absolute;
    left:302px;
}
.slide-right-leave-active{
    will-change : transform;
    transition: all .3s;
    position: absolute;
    left : 0;
}
.slide-left-leave-active{
    will-change : transform;
    transition: all .3s;
    position: absolute;
    left : -302px;
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
.trans-box{
    width : 100%;
    height : 100%;
}
.fa-box{
    width : 302px;
    height: 102px;
    overflow: hidden; 
    margin : 30px auto;
    position: relative;
    border : 1px solid #ccc;
}
.box{
    width : 300px;
    height : 100px;
    background : #ccc;
    border : 1px solid red;
    position: absolute;
    top : 0;
    left : 0;
}
.box1{
    width : 300px;
    height : 100px;
    background : blue;
    border : 1px solid red;
    position: absolute;
    top : 0;
    left : 0;
}
</style>

