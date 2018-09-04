<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
          <el-date-picker
            v-model="valueDate"
            type="date"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions0"
            @change="changeDate">
          </el-date-picker>
          <!-- <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']">
          </el-date-picker> -->
          <el-button type="primary" @click="getMonitorByDay">查询</el-button>
      </div>
      <el-row class="line-chart-box" v-if="alarmList.length">
        <el-col :xs="24" :sm="24" :lg="24" v-for="item in alarmShowList" :key="item.index">
          <lineChart :chartData="item" :historyM="historyM"></lineChart>
        </el-col>
      </el-row>
      <DefaultPage v-if="!alarmList.length"></DefaultPage>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="alarmList.length">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>


<script>
import '@/styles/roleuser.scss'
import Cookies from 'js-cookie'
import queryInfo from '@/utils/queryInfo'
import { getMonitorByDay } from '@/api/bridgeInfo'
import { parseTime } from '@/utils'
import lineChart from '../lineChart/LineChart'

import DefaultPage from '@/components/DefaultPage'

export default {
  data() {
    return {
      historyM: true,
      bridgeId: '',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      valueDate: this.formatTime((new Date()).getTime() + ((8 - 24) * 60 * 60 * 1000)),
      dateRange: '',
      serverSeqArr: [],
      alarmList: [],
      monitorCache: [],
      pageSize: 2,
      pageNo: 1
    }
  },
  components: {
    lineChart,
    DefaultPage
  },
  computed: {
    alarmShowList() {
      return this.alarmList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  created() {
    this.bridgeId = Cookies.get('bridgeId')
    this.serverSeqArr = queryInfo.queryServers(this.bridgeId, true)
    if (this.serverSeqArr.length) {
      this.getMonitorByDay()
    }
  },
  methods: {
    formatTime(time) {
      var d = new Date()
      d.setTime(time)
      d = JSON.stringify(d).replace(/[^\d]/g, '').substring(0, 8)
      return d
    },
    getMonitorByDay() {
      var that = this
      var date = that.valueDate
      var arr = this.serverSeqArr
      getMonitorByDay({ seq: arr, day: date }).then(res => {
        if (res.success && res.data) {
          var monitorList = []
          for (let i = 0; i < res.data.length; i++) {
            var str = res.data[i].cid
            var monitorData = null
            for (let j = 0; j < monitorList.length; ++j) {
              if (str === monitorList[j].tit) {
                monitorData = monitorList[j]
                break
              }
            }
            if (!monitorData) {
              monitorData = {
                tit: '',
                xData: [],
                seData: []
              }
              monitorList.push(monitorData)
              monitorData.tit = str
            }
            monitorData.xData.push(parseTime(res.data[i].ctime, true, true).substring(11, 19))
            monitorData.xData.push(parseTime(res.data[i].ctime, true, true).substring(11, 19))
            monitorData.seData.push(res.data[i].hvalue)
            monitorData.seData.push(res.data[i].lvalue)
          }
          that.alarmList = monitorList
        }
      })
    },
    changeDate(val) {
      this.valueDate = val
      if (this.serverSeqArr.length) {
        this.getMonitorByDay()
      }
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
  .el-button{
    padding: 12px 20px;
    margin-left: 15px;
  }
}
</style>
