<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
        <span>{{alarmTime}}</span>
        <span>{{alarmTit}}</span>
      </div>
      <el-row class="line-chart-box">
        <el-col :xs="24" :sm="24" :lg="24" v-for="(item, index) in alarmShowList" :key="item.index">
          <lineChart :chartData="item" :lineColor="index"></lineChart>
        </el-col>
      </el-row>
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
      alarmId: '',
      alarmTit: '',
      alarmRead: false,
      alarmList: [],
      pageSize: 6,
      pageNo: 1,
      intervalTime: (3 * 1000) / 300
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
    getDangerDetail() {
      var that = this
      const param = {
        aid: this.alarmId
      }
      getDangerDetail(param).then(res => {
        if (res.success && res.data) {
          var rList = []
          var startTime = ''
          for (let i = 0; i < res.data.length; i++) {
            startTime = parseTime(res.data[0].stime, true, true)
            var str = res.data[i].seq
            var rData = {
              tit: '',
              xData: [],
              seData: []
            }
            rList.push(rData)
            rData.tit = str
            var dataArr = JSON.parse('[' + String(res.data[i].data.split(',')) + ']')
            var timeArr = []
            for (var j = 0; j < dataArr.length; j++) {
              startTime = turnTime(new Date(+new Date(startTime) + that.intervalTime), 'time', true)
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
