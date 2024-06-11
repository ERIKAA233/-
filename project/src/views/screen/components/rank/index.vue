<template>
  <div class="box6">
    <div class="title">
      <p>景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import {ref,onMounted} from 'vue'
//获取dom节点
let charts=ref()
//组件挂载完毕
onMounted(()=>{
  //一个容器可以同时展示多种类型的图形图标
  let mychart=echarts.init(charts.value)
  //设置配置项
  mychart.setOption({
    title:{
      text:'景区排行',
      link:'http://baidu.com',
      left:'50%',
      //主标题文字样式
      textStyle:{
        color:'white',
        fontSize:20
      },
      //子标题
      subtext:'各大景区排行',
      //子标题样式
      subtextStyle:{
        color:'gray',
        fontSize:16,
      }
    },
    //xy轴
    xAxis:{
      type:'category'
    },
    yAxis:{},
    grid:{
      left:20,
      bottom:20,
      right:20
    },
    series:[
      {
      type:'bar',
      data:[10,20,30,40,50,60,70],
      color:'blue',
      label:{
        show:true,
        position:'insideTop'
      },
      showBackground:true,
      },
    ],
    tooltip:{}
  })
})
</script>

<style scoped lang="scss">
.box6{
  width:100%;
  height:100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin:20px 0;
  .title {
      margin-top:25px;
      margin-left:10px;
      p {
        color: white;
        font-size: 20px;
      }
  }
  .charts{
    height:calc(100% - 30px);

  }
}
</style>