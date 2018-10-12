<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    lineColor: {
      type: Number,
      default: 0
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    maxXcount: {
      type: Number
    },
    historyM: { // 判断是否需要坐标轴上的滚动条
      type: Boolean
    }
  },
  data() {
    return {
      lineColorNow: this.lineColor % 2 === 0 ? '#FF005A' : '#3888fa',
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions(datastr) {
      this.chart.setOption({
        title: {
          text: '传感器' + datastr.tit,
          textStyle: {
            color: '#333',
            fontSize: 14
          },
          top: '0'
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        xAxis: {
          data: datastr.xData,
          max: this.maxXcount
        },
        yAxis: {
          type: 'value',
          max: 9000,
          min: -9000
        },
        legend: {
          data: ['信号值']
        },
        series: [{
          name: '信号值', itemStyle: {
            normal: {
              color: this.lineColorNow,
              lineStyle: {
                color: this.lineColorNow,
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: datastr.seData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
      if (datastr.xInterval) {
        this.chart.setOption({
          xAxis: {
            axisLabel: {
              interval: datastr.xInterval
            }
          }
        })
      }
      if (this.historyM) {
        this.chart.setOption({
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ]
        })
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      var that = this
      setTimeout(function() {
        that.setOptions(that.chartData)
      }, 1)
    }
  }
}
</script>
