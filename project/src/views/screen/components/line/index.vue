<template>
  <div class="box5">
    <div class="title">
      <p>未来7天游客量趋势图</p>
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    title: {
    },
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      //轴线设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40, top: 0, right: 10, bottom: 20
    },
    series: [{
      type: 'line',
      data: [1120, 1240, 1166, 1199, 2181, 2311, 3420],
      smooth: true,
      //区域填充
      areaStyle: {
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
          global: false // 缺省为 false
        }
      }
    }]
  })
})

</script>
<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
