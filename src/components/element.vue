<template>
    <div class="element">
        <div class="box">
            <div class="line"
                :style="{height:height+'px'}"
            ></div>
        </div>
    </div>
</template>
<script>
export default {
    name : 'element',
    data(){
        return {
            height : 1,
            timer : '',
            timeC : 1,
        }
    },
    methods : {
        lineTo(a , b , c , t){
            return a*(pow3(t-1) + 1) + b;
        },
        moveFn(){},
    }
}
</script>
<style>
.line{
    width : 100%;
    height : 100%;
    background : aqua;
    position: absolute;
    bottom : 0;
    left : 0;
}
.box{
    width: 400px;
    height: 800px;
    border : 1px solid #ccc;
    overflow: hidden;
    position: relative;
}
</style>

