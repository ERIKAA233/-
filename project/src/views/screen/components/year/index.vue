<template>
  <div class="box7">
    <div class="title">
      <p>游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取dom节点
let charts = ref()
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mychart = echarts.init(charts.value)
  //设置配置项
  mychart.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white',
      }
    },
    xAxis: {
      type: 'category',
      show: true
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 20, top: 20, right: 0, botton: 20
    },
    series: {
      type: 'scatter',
      data: [33, 88, 21, 8, 788, 32, 121, 333, 456, 311, 434, 123, 431, 743],
      label:{
        show:true,
        position:'top',
        color:'white',
      }
    }
  })
})


</script>
<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    margin-top: 15px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px)
  }
}
</style>
