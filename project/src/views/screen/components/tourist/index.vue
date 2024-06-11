<template>
  <div class="box">
    <div class="top">
      <p>实时游客统计</p>
      <img src="../../images/dataScreen-title.png" alt="">
      <p class="right">可预约总量<span>99999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item,index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts">123</div>
  </div>
</template>
<script setup lang="ts">
import {ref,onMounted} from 'vue'
import * as echarts from 'echarts'
//水球图拓展
import 'echarts-liquidfill'
let people=ref('216908人')
let charts=ref()
onMounted(()=>{
  //获取echarts实例
  let mycharts=echarts.init(charts.value)
  //获取实例配置项
  mycharts.setOption({
    //标题组件
    title: {
      text: '水球图'
    },
    //x|y轴组件
    xAxis: {},
    yAxis: {},
    //系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill',//系列
      data: [0.6, 0.4, 0.2],//展示的数据
      waveAnimation: true,//动画
      animationDuration: 3,
      animationDurationUpdate: 0,
      radius: '100%',//半径
      outline: {//外层边框颜色设置
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'skyblue',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
    },
    //布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }

  })
})

</script>
<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    font-size:20px;
    p{
      color:white;
    }
    .title {
      color:white;
      font-size:20px;
    }
    .bg{
      width:68px;
      height:7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size:100% 100%;
      margin-top:10px;
    }
    .right{
      float:right;
      color:white;
      font-size:20px;
      .span{
        color:orange;
      }
    }
  }
  .number{
    margin-top:30px ;
    display:flex;
    padding:10px;
    span{
      flex:1;
      height:40px;
      text-align:center;
      line-height:40px;
      background:url(../../images/total.png) no-repeat;
      background-size:100% 100%;
      color:#29fcff;
      font-size:20px;
    }
  }
  .charts{
    width: 100%;
    height:270px;
  }
}
</style>
