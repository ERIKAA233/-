<template>
  <div>
    <svg :style="{width,height}">
      <use :xlink:href="prefix+name" :fill="color"></use>
      <!-- <use xlink:href='#icon-add'></use> -->
    </svg>
  </div>

</template>

<script setup lang='ts'>
//接受父组件传递过来的参数
defineProps({
  prefix:{
    type:String,
    default:'#icon-'
  },
  //接受使用的图标名
  name:String,
  //接受父组件传递的颜色
  color:{
    type:String,
    default:''
  },
  //接受父组件传递过来的图标高宽
  width:{
    type:String,
    default:'16px'
  },
  height: {
    type: String,
    default: '16px'
  }

})

</script>

<style scoped>
</style>