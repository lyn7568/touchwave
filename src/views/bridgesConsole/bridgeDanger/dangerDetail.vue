<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
        <span>{{alarmTime}}</span>
        <span>{{alarmTit}}</span>
      </div>
      <el-row class="line-chart-box">
        <el-col :xs="24" :sm="24" :lg="24" v-for="(item, index) in alarmShowList" :key="item.index">
          <lineChart :chartData="item.data" :startTime="item.stime" :legendName="'传感器' + item.seq" :lineColor="index" :intervalTime="intervalTime"></lineChart>
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
import { urlParse, parseTime } from '@/utils'
import { getDangerDetail, setUnreadToRead } from '@/api/bridgeInfo'
import lineChart from '../lineChart/LineChart'

export default {
  data() {
    return {
      alarmId: '',
      alarmTit: '',
      alarmList: [],
      pageSize: 6,
      pageNo: 1,
      intervalTime: 3 * 1000
    }
  },
  components: {
    lineChart
  },
  created() {
    this.alarmId = urlParse('aid')
    this.alarmTit = urlParse('msg')
    this.getDangerDetail()
    this.setUnreadToRead()
  },
  computed: {
    alarmTime() {
      const alramM = this.alarmId.split('_')
      return parseTime(alramM[ alramM.length - 1], true)
    },
    alarmShowList() {
      return this.alarmList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    getDangerDetail() {
      const param = {
        aid: this.alarmId
      }
      getDangerDetail(param).then(res => {
        if (res.success && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            const arr = JSON.parse('[' + String(res.data[i].data.split(',')) + ']')
            res.data[i].data = arr
          }
          this.alarmList = res.data
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
