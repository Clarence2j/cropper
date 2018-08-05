<template>
    <div class="hoverTest">
        <router-link class="box" to="/index"
            v-for="(item , index) in arr"
            :key="index"
            :class="state == index ? 'ccc ddd' : ''"
            @click="chooseFn(index)"
        >
            {{item.name}}
        </router-link>
    </div>
</template>
<script>
export default{
    name : 'HoverTeset',
    data(){
        return {
            arr : [
                {
                    name : 1
                },
                {
                    name : 1
                },
                {
                    name : 1
                },
                {
                    name : 1
                },
                {
                    name : 1
                },
                {
                    name : 1
                },
            ],
            state : 0,
        }
    },
    methods : {
        chooseFn(index){
            this.state = index;
        }
    }
}
</script>
<style scoped>
.box{
    width : 100px;
    height : 50px;
    border : 1px solid #ccc;
    float : left;
    margin-left : 10px;
}
.box:hover.ccc{
    background : red;
}
.ddd{
    color : #fff;
}
</style>

