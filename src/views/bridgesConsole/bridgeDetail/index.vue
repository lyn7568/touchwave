<template>
  <div class="dashboard-editor-container">
    <BInfoDialog01 ref="BInfoDialog01"></BInfoDialog01>
    <BInfoDialog02 ref="BInfoDialog02"></BInfoDialog02>
    <BInfoDialog03 ref="BInfoDialog03"></BInfoDialog03>
    <BInfoDialog04 ref="BInfoDialog04"></BInfoDialog04>

    <updatePersonInfo ref="updatePersonInfo"></updatePersonInfo>
    <updateLoginPwd ref="updateLoginPwd"></updateLoginPwd>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="15" :lg="18">
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>报警信息</span>
            <el-button type="text" @click="queryDangerInfo">查看全部</el-button>
          </div>
          <ul class="item-ul" v-if="dangerList.length">
            <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerList" :key="item.index" @click="alarmShow(item.aid, item.device)">
              <span>{{item.alarmTime}}</span>
              <span>{{item.device}}，请点击查看。</span>
              <span class="svg-container" v-if="!item.readed">
                <svg-icon icon-class="unread"></svg-icon>
              </span>
            </li>
          </ul>
          <DefaultPage v-if="!dangerList.length"></DefaultPage>
        </el-card>
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>实时监测</span>
          </div>
          <el-row class="line-chart-box" v-if="monitorList.length">
            <el-col :xs="24" :sm="24" :lg="24" v-for="item in monitorShowList" :key="item.index">
              <lineChart2 :chartData="item"></lineChart2>
            </el-col>
          </el-row>
          <DefaultPage v-if="!monitorList.length"></DefaultPage>
          <div class="pagination-container">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page.sync="currentNo"
              :page-size="currentSize"
              layout="prev, pager, next, jumper"
              :total="this.monitorList.length">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="9" :lg="6">
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>基础信息查看</span>
          </div>
          <el-row :gutter="10" class="item-row">
            <el-col :span="12"><div class="grid-content" @click="queryBirdgeInfo">桥梁信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="queryServerInfo">采集服务器信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="queryBoxInfo">采集盒信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="querySensorInfo">传感器信息</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>常用操作</span>
          </div>
          <el-row :gutter="10" class="item-row">
            <el-col :span="12"><div class="grid-content" @click="queryDangerInfo">历史报警信息查询</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="queryMonitorInfo">历史监测信息查询</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="updatePersonInfo">修改个人信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="updateLoginPwd">修改登录密码</div></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import '@/styles/roleuser.scss'
import Cookies from 'js-cookie'
import queryInfo from '@/utils/queryInfo'
import { urlParse, parseTime, turnTime } from '@/utils'
import { getDangerList, getTimingMonitor } from '@/api/bridgeInfo'
import { mainCable, location, provinceCityDistrict } from '@/api/numberDictionary'

import lineChart2 from '../lineChart/LineChart2'
import BInfoDialog01 from './components/BInfoDialog01'
import BInfoDialog02 from './components/BInfoDialog02'
import BInfoDialog03 from './components/BInfoDialog03'
import BInfoDialog04 from './components/BInfoDialog04'

import updatePersonInfo from './components/updatePersonInfo'
import updateLoginPwd from './components/updateLoginPwd'

import DefaultPage from '@/components/DefaultPage'

export default {
  name: 'dashboard-other',
  components: {
    lineChart2,
    BInfoDialog01,
    BInfoDialog02,
    BInfoDialog03,
    BInfoDialog04,
    updatePersonInfo,
    updateLoginPwd,
    DefaultPage
  },
  data() {
    return {
      bridgeId: '',
      bridgeName: '',
      dialogW: '860px',
      citys: [],
      cableMain: [],
      addr: [],
      dangerList: '',
      serverSeqArr: [],
      monitorList: [],
      currentNo: 1,
      currentSize: 4,
      currentTime: turnTime(new Date()),
      dateArr: [],
      intervalTime: 60 * 1000
    }
  },
  computed: {
    monitorShowList() {
      return this.monitorList.slice((this.currentNo - 1) * this.currentSize, this.currentNo * this.currentSize)
    }
  },
  created() {
    if (urlParse('id')) {
      this.bridgeId = urlParse('id')
      this.bridgeName = urlParse('name')
    } else {
      this.bridgeId = Cookies.get('bridgeId')
      this.bridgeName = Cookies.get('bridgeName')
    }
    this.getDictoryData()
    if (this.bridgeId) {
      this.serverSeqArr = queryInfo.queryServers(this.bridgeId, true)
      if (this.serverSeqArr.length) {
        this.getTimingMonitor(this.serverSeqArr)
        this.getDangerList(this.serverSeqArr)
      }
    }
    // setInterval(() => {
    //   this.addData(true)
    //   this.getTimingMonitor()
    // }, 60000)
  },
  methods: {
    getDangerList(arr) {
      const param = {
        seq: arr,
        pageSize: 5,
        pageNo: 1
      }
      getDangerList(param).then(res => {
        if (res.success && res.data.data) {
          const dataS = res.data.data
          for (let i = 0; i < dataS.length; i++) {
            if (dataS[i].alarmTime) {
              dataS[i].alarmTime = parseTime(dataS[i].alarmTime, true)
            }
            dataS[i].device = `${this.bridgeName}大桥${dataS[i].device}采集盒检测到异常情况`
          }
          this.dangerList = dataS
        }
      })
    },
    getTimingMonitor(arr) {
      var that = this
      const param = {
        seq: arr
      }
      getTimingMonitor(param).then(res => {
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
              that.addData()
            }
            monitorData.xData.push(that.dateArr)
            monitorData.seData.max.push(res.data[i].hvalue)
            monitorData.seData.min.push(res.data[i].lvalue)
          }
          that.monitorList = monitorList
        }
      })
    },
    getDictoryData() {
      mainCable().then(response => {
        if (response.success) {
          response.data.map(item => {
            this.cableMain[item.code] = item.caption
          })
        }
      }).then(response => {
        location().then(response => {
          if (response.success) {
            response.data.map(item => {
              this.addr[item.code] = item.caption
            })
          }
        })
      })
      provinceCityDistrict().then(response => {
        if (response.success) {
          response.data.map(item => {
            this.citys[item.code] = item.fullCaption
          })
        }
      })
    },
    addData(shift) {
      this.dateArr.push(this.currentTime)
      if (shift) {
        this.dateArr.shift()
      }
      this.currentTime = turnTime(new Date(+new Date(this.currentTime) + this.intervalTime))
    },
    handleCurrentChange(val) {
      this.currentNo = val
    },
    alarmShow(id, msg) {
      this.$router.push({
        name: 'dangerDetail',
        query: { aid: id, msg: msg }
      })
    },
    queryDangerInfo() {
      this.$router.push({ name: 'dangerList' })
    },
    queryMonitorInfo() {
      this.$router.push({ name: 'bridgeMonitor' })
    },
    queryBirdgeInfo() {
      this.$refs.BInfoDialog01.dialogTableVisible = true
    },
    queryServerInfo() {
      this.$refs.BInfoDialog02.dialogTableVisible = true
    },
    queryBoxInfo() {
      this.$refs.BInfoDialog03.dialogTableVisible = true
    },
    querySensorInfo() {
      this.$refs.BInfoDialog04.dialogTableVisible = true
    },
    updatePersonInfo() {
      this.$refs.updatePersonInfo.dialogTableVisible = true
      this.$refs.updatePersonInfo.getUserSelf()
    },
    updateLoginPwd() {
      this.$refs.updateLoginPwd.dialogTableVisible = true
    }
  }
}
</script>
