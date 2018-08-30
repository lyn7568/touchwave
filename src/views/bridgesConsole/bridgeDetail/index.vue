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
            <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerList" :key="item.index" @click="alarmShow(item.aid, item.readed, item.device)">
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
              <lineChart2 :chartData="item" :maxXcount="maxShowLength"></lineChart2>
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
import queryDict from '@/utils/queryDict'
import { urlParse, parseTime, turnTime } from '@/utils'
import { getDangerList, getTimingMonitor, getTimingMonitorByTime } from '@/api/bridgeInfo'

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
      citys: {},
      cableMain: {},
      addr: {},
      dangerList: '',
      serverSeqArr: [],
      monitorList: [],
      currentNo: 1,
      currentSize: 4,
      currentTime: turnTime(new Date(), 'time', true),
      setTime: null,
      maxShowLength: 300,
      monitorCache: []
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
        this.setTime = setInterval(() => {
          this.getTimingMonitor(this.serverSeqArr)
        }, 1000)
      }
    }
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
    addData() {
      this.currentTime = turnTime(new Date(+new Date(this.currentTime) + 1000), 'time', true)
    },
    getTimingMonitor(arr) {
      var that = this
      const param = {
        seq: arr
      }
      getTimingMonitor({seq: arr}).then(res => {
        if (res.success && res.data) {
          that.addData()
          var monitorList = []
          var monitorCache = that.monitorCache
          if (monitorCache.length) {
            for(let j = 0; j < monitorCache.length; ++j){
              let channel_found = false
              var xData = monitorCache[j].cd.xData
              var max = monitorCache[j].cd.seData.max
              var min = monitorCache[j].cd.seData.min
              for (let i = 0; i < res.data.length; i++){
                if(monitorCache[j].cid === res.data[i].cid){
                  channel_found = true
                  xData.push(that.currentTime)
                  max.push(res.data[i].hvalue)
                  min.push(res.data[i].lvalue)
                  break
                }
              }
              if (!channel_found) {
                xData.push(that.currentTime)
                max.push(max[max.length-1])
                min.push(min[min.length-1])
              }
              if (xData.length > that.maxShowLength) {
                xData.shift()
                max.shift()
                min.shift()
              }
              monitorList.push(monitorCache[j].cd)
            }
          } else {
            for (let i = 0; i < res.data.length; i++){
              var mi = {
                cid: res.data[i].cid,
                cd: {
                  xData: [],
                  seData: {
                    max: [],
                    min: []
                  }
                }
              }
              mi.cd.xData.push(that.currentTime)
              mi.cd.seData.max.push(res.data[i].hvalue)
              mi.cd.seData.min.push(res.data[i].lvalue)
              mi.cd.tit = res.data[i].cid
              monitorCache.push(mi)
              monitorList.push(mi.cd)
            }
          }
          that.monitorList = monitorList
        }
      })
    },
    getDictoryData() {
      const that = this
      queryDict.applyDict('ZLLX', function(dictData) {
        dictData.map(item => {
          that.cableMain[item.code] = item.caption
        })
      }) // 主缆
      queryDict.applyDict('ZLWZ', function(dictData) {
        dictData.map(item => {
          that.addr[item.code] = item.caption
        })
      }) // 位置
      queryDict.applyDict('XZQH', function(dictData) {
        dictData.map(item => {
          that.citys[item.code] = item.fullCaption
        })
      }) // 城市级联
    },
    handleCurrentChange(val) {
      this.currentNo = val
    },
    alarmShow(id, flag, msg) {
      this.$router.replace({
        name: 'dangerDetail',
        query: { aid: id, msg: msg, flag: flag }
      })
    },
    queryDangerInfo() {
      this.$router.replace({ name: 'dangerList' })
    },
    queryMonitorInfo() {
      this.$router.replace({ name: 'bridgeMonitor' })
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
  },
  beforeDestroy() {
    clearInterval(this.setTime)
  }
}
</script>
