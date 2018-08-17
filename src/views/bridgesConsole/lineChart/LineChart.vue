<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import { parseTime, turnTime } from '@/utils'
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
      default: '260px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array
    },
    legendName: {
      type: String
    },
    startTime: {
      type: String
    },
    intervalTime: {
      type: Number
    }
  },
  data() {
    return {
      lineColorNow: this.lineColor % 2 === 0 ? '#FF005A' : '#3888fa',
      Ydate: [],
      nowTime: parseTime(this.startTime, true, true),
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

    // 监听侧边栏的变化
    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    // const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    // sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

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
    addData() {
      this.Ydate.push(this.nowTime)
      this.nowTime = turnTime(new Date(+new Date(this.nowTime) + this.intervalTime), 'time', true)
    },
    setOptions(datastr) {
      this.chart.setOption({
        xAxis: {
          data: this.Ydate,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          // name: '豪伏(-8192-8192)',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [this.legendName]
        },
        series: [{
          name: this.legendName, itemStyle: {
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
          data: datastr,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    },
    initChart() {
      for (var i = 1; i < this.chartData.length; i++) {
        this.addData()
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
