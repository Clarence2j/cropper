<template>
    <div class="test-id-name">
        <div id="ccc" @click="alertName">5555555555</div>
    </div>
</template>
<script>
export default {
    name : 'TestIdName',
    data(){
        return {}
    },
    methods : {
        alertName(){
            alert(ccc.offsetWidth)
        }
    }
}
</script>

