<template>
  <!-- 权限显示插槽 -->
  <span v-if="showRule">
    <slot></slot>
  </span>
</template>
<script>
    
export default {
    data(){
        return {
           showRule:false,
        }
    },
    props:{
        name:{
            type:String,
            default:'',
        }
    },
    methods:{
      
    },
    created(){
        let buttonList = this.$store.state.app.buttonRoleList;
        this.showRule = buttonList.includes(this.name);
    }
};
</script>
<style scoped>

</style>