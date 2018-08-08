<template>
    <div class="test-id">
        <div id="ccc" @click="alertName">123131312</div>
        <!-- <test-id-name></test-id-name>    -->
    </div>
</template>
<script>
import TestIdName from './test-id-name'
export default{
    name : 'TestId',
    data(){
        return {}
    },
    methods : {
        alertName (){
            alert(ccc.offsetWidth)
        }
    },
    components : {
        TestIdName
    }
}
</script>
