<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
          <el-date-picker
            style="width: 200px;margin-right:15px"
            v-model="valueDate"
            :editable="false"
            type="date"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions0"
            @change="changeDate">
          </el-date-picker>
          <el-select v-model="TimeVal">
            <el-option
              v-for="item in optionsTime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disb"
              @change="changeTimeRange">
            </el-option>
          </el-select>
          <el-button type="primary" @click="getMonitorByDay" :disabled="progressShow">查询</el-button>
      </div>
      <el-row class="line-chart-box">
        <div class="progress-box" v-if="progressShow">
          <span>正在加载 {{proBar}}%</span>
          <el-progress :text-inside="true" :stroke-width="18" :percentage="proBar"></el-progress>
        </div>
        <el-col :xs="24" :sm="24" :lg="24" v-for="item in alarmShowList" :key="item.index" v-if="alarmList.length">
          <lineChart :chartData="item" :historyM="historyM"></lineChart>
        </el-col>
      </el-row>
      <DefaultPage v-if="!alarmList.length && !progressShow"></DefaultPage>
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
import NProgress from 'nprogress'

export default {
  data() {
    return {
      historyM: true,
      bridgeId: '',
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      valueDate: this.formatTime(Date.now()).substring(0, 8),
      TimeVal: '000000',
      optionsTime: [],
      serverSeqArr: [],
      alarmList: [],
      monitorCache: [],
      pageSize: 2,
      pageNo: 1,
      progressShow: false,
      proBar: 0
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
    var that = this
    that.bridgeId = Cookies.get('bridgeId')
    that.optionsCreat()
    queryInfo.qaiCb(function() {
      if (that.bridgeId) {
        that.serverSeqArr = queryInfo.queryServers(that.bridgeId, true)
        if (that.serverSeqArr.length) {
          that.getMonitorByDay()
        }
      }
    })
  },
  methods: {
    optionsCreat() {
      var that = this
      that.optionsTime = []
      const nowHour = new Date().getHours()
      for (let i = 0; i < 24; i++) {
        var num = (i < 10 ? ('0' + i) : i)
        var numpre = ((i - 1) < 10 ? ('0' + (i - 1)) : (i - 1))
        var oPt = {
          value: `${num}0000`,
          label: `${num}:00:00 - ${num}:59:59`,
          disb: false
        }
        if (nowHour === i) {
          that.TimeVal = `${numpre}0000`
        }
        if (nowHour <= i && that.valueDate === that.formatTime(Date.now()).substring(0, 8)) {
          oPt.disb = true
        }
        that.optionsTime.push(oPt)
      }
    },
    formatTime(time) {
      var d = new Date()
      d.setTime(time)
      d = JSON.stringify(d).replace(/[^\d]/g, '')
      return d
    },
    changeProgress() {
      var that = this
      var clearInt = setInterval(function() {
        that.proBar = that.proBar + parseInt((Math.random() * 10), 10)
        if (that.proBar >= 96) {
          that.proBar = 96
          clearInterval(clearInt)
        }
      }, 1500 * Math.random())
    },
    getMonitorByDay() {
      var that = this
      that.progressShow = true
      NProgress.start()
      that.proBar = 0
      that.alarmList = []
      that.changeProgress()
      var sDate = that.valueDate + that.TimeVal
      var sDateForm = (new Date(parseTime(sDate, true, true))).getTime()
      var eDate = that.formatTime(sDateForm + 8 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000).substring(0, 14)
      var arr = that.serverSeqArr
      var flag = false
      if (that.valueDate === that.formatTime(Date.now()).substring(0, 8)) {
        flag = true
      }
      getMonitorByDay({ seq: arr, begin: sDate, end: eDate }, flag).then(res => {
        NProgress.inc()
        if (res.success && res.data) {
          that.proBar = 100
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
          if (that.proBar === 100) {
            that.alarmList = monitorList
            setTimeout(function() {
              that.progressShow = false
            }, 1)
          }
        }
      })
    },
    changeDate(val) {
      this.valueDate = val
      this.optionsCreat()
    },
    changeTimeRange(val) {
      this.TimeVal = val
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
.progress-box{
  width: 400px;
  padding: 80px;
  margin: auto;
  text-align: center;
  line-height: 40px;
  color:#999;
  font-size:13px;
}
</style>
