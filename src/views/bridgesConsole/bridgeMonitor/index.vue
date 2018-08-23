<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
          <el-date-picker
            v-model="valueDate"
            type="date"
            value-format="yyyyMMdd"
            @change="changeDate">
          </el-date-picker>
          <el-button type="primary" @click="getMonitorByDay">查询</el-button>
      </div>
      <el-row class="line-chart-box" v-if="alarmList.length">
        <el-col :xs="24" :sm="24" :lg="24" v-for="item in alarmShowList" :key="item.index">
          <lineChart2 :chartData="item"></lineChart2>
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
import { parseTime } from '@/utils'
import { getMonitorByDay } from '@/api/bridgeInfo'
import lineChart2 from '../lineChart/LineChart2'

import DefaultPage from '@/components/DefaultPage'

export default {
  data() {
    return {
      bridgeId: '',
      valueDate: new Date().toISOString().substring(0, 10).replace(/-/g, ''),
      serverSeqArr: [],
      alarmList: [],
      pageSize: 2,
      pageNo: 1
    }
  },
  components: {
    lineChart2,
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
      this.getMonitorByDay(this.serverSeqArr)
    }
  },
  methods: {
    getMonitorByDay(arr) {
      var that = this
      var date = that.valueDate
      var param = {
        seq: arr,
        day: date
      }
      getMonitorByDay(param).then(res => {
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
                xData: [],
                seData: {
                  max: [],
                  min: []
                }
              }
              monitorList.push(monitorData)
              monitorData.tit = str
            }
            monitorData.xData.push(parseTime(res.data[i].ctime, true, true))
            monitorData.seData.max.push(res.data[i].hvalue)
            monitorData.seData.min.push(res.data[i].lvalue)
          }
          that.alarmList = monitorList
        }
      })
    },
    changeDate(val) {
      this.valueDate = val
      this.getMonitorByDay()
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
