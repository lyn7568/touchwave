<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
        <span>{{alarmTime}}</span>
        <span>{{alarmTit}}</span>
      </div>
      <div class="load-box" v-loading="loadprogress">
        <el-row class="line-chart-box">
          <el-col :xs="24" :sm="24" :lg="24" v-for="item in alarmShowList" :key="item.index">
            <lineChart :chartData="item" :historyM="historyM"></lineChart>
          </el-col>
        </el-row>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="alarmList.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { urlParse, parseTime, turnTime } from '@/utils'
import { getDangerDetail, setUnreadToRead } from '@/api/bridgeInfo'
import lineChart from '../lineChart/LineChart'

export default {
  data() {
    return {
      historyM: true,
      alarmId: '',
      alarmTit: '',
      alarmRead: false,
      alarmList: [],
      pageSize: 6,
      pageNo: 1,
      loadprogress: false
    }
  },
  components: {
    lineChart
  },
  created() {
    this.alarmId = urlParse('aid')
    this.alarmTit = urlParse('msg')
    this.alarmRead = urlParse('flag')
    this.alarmTime = urlParse('_t')
    this.getDangerDetail()
    if (this.alarmRead === 'false') {
      this.setUnreadToRead()
    }
  },
  computed: {
    alarmShowList() {
      return this.alarmList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    addDate(time) {
      return turnTime(new Date(+new Date(time) + 1000), 'time', true)
    },
    getDangerDetail() {
      var that = this
      const param = {
        aid: this.alarmId
      }
      this.loadprogress = true
      getDangerDetail(param).then(res => {
        if (res.success && res.data) {
          that.loadprogress = false
          var rList = []
          for (let i = 0; i < res.data.length; i++) {
            var startTime = parseTime(res.data[i].stime, true, true)
            var str = res.data[i].seq
            var rData = {
              tit: '',
              xData: [],
              seData: [],
              xInterval: 99
            }
            rList.push(rData)
            rData.tit = str
            var dataArr = JSON.parse('[' + String(res.data[i].data.split(',')) + ']')
            var timeArr = []
            for (var j = 0; j < dataArr.length; ++j) {
              if (j === 99 || j === 199 || j === 299) {
                startTime = that.addDate(startTime)
              }
              timeArr.push(startTime)
            }
            rData.xData = timeArr
            rData.seData = dataArr
          }
          that.alarmList = rList
        }
      })
    },
    setUnreadToRead() {
      const param = {
        aid: this.alarmId
      }
      setUnreadToRead(param).then(res => {
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container .block-group .block-title{
  justify-content: flex-start;
  span{
    margin-right: 15px;
  }
}
</style>
