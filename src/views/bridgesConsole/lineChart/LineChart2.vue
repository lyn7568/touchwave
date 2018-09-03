<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
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
          left: 16
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 50,
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
          boundaryGap: false,
          axisTick: {
            show: false
          },
          max: this.maxXcount // x轴最多显示个数
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} mv'
          },
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['最大值', '最小值']
        },
        series: [{
          name: '最大值', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: datastr.seData.max,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, {
          name: '最小值', itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: datastr.seData.min,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
      if (this.historyM) {
        this.chart.setOption({
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 94,
              end: 100,
              handleSize: 8
            },
            {
              type: 'inside',
              start: 94,
              end: 100
            },
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 12,
              height: '70%',
              handleSize: 8,
              showDataShadow: false,
              left: '98%'
            }
          ]
        })
      }
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
