<template>
  <div class="box4" ref="map">


  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let map = ref()
//引入中国地图的json数据
import chinaJSON from './china.json'
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value)
  //设置配置项
  mychart.setOption({
    //地图
    geo: {
      map: 'china',
      roam: true,
      //地图的位置调试
      left: 150,
      top: 100,
      right: 50,
      bottom: 10,
      //地图上的文字设置
      label: {
        show: true,//文字显示 
        color: 'white',
        fontSize: 15,
      },
      //每一个多边形的样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'blue' // 0% 处的颜色
          }, {
            offset: 1, color: 'white' // 100% 处的颜色
          }],
          global: false
        },
        opacity: .5,
      },
      //地图高亮效果
      emphasis: {
        itemStyle: {
          color: 'aquablue'
        },
        label: {
          fontSize: 20,
        }
      }
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989], //起点
              [127.693027, 48.040465] //终点
            ],
            lineStyle: {
              color: 'white',
              width: 3,
            },

          },
          {
            coords: [
              [121.472644, 31.231706], //起点
              [127.693027, 48.040465] //终点
            ],
            lineStyle: {
              color: 'white',
              width: 3,
            },
          }
        ],
        //动画特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'blue',
          symbolSize: 10,
        }
      }
    ]
  })
})
</script>
<style scoped></style>
