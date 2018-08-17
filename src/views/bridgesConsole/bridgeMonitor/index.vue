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
      <el-row class="line-chart-box">
        <el-col :xs="24" :sm="24" :lg="24" v-for="item in alarmShowList" :key="item.index">
          <lineChart2 :chartData="item"></lineChart2>
        </el-col>
      </el-row>
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
import { urlParse, parseTime } from '@/utils'
import { Message } from 'element-ui'
import { getMonitorByDay } from '@/api/bridgeInfo'
import lineChart2 from '../lineChart/LineChart2'

export default {
  data() {
    return {
      valueDate: new Date().toISOString().substring(0, 10).replace(/-/g, ''),
      serverSeqArr: [],
      alarmList: [],
      pageSize: 2,
      pageNo: 1
    }
  },
  components: {
    lineChart2
  },
  computed: {
    alarmShowList() {
      return this.alarmList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  created() {
    this.serverSeqArr = urlParse('arr')
    this.getMonitorByDay()
  },
  methods: {
    getMonitorByDay() {
      var that = this
      const arr = this.serverSeqArr
      if (arr) {
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
      } else {
        Message.error('当前没有任何采集服务器，请检查')
      }
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
