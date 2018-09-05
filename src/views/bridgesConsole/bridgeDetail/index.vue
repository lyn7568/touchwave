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
            <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerList" :key="item.index" @click="alarmShow(item.aid, item.readed, item.alarmTime, item.device)">
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
              <lineChart :chartData="item" :maxXcount="maxShowLength"></lineChart>
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
import monModel from '@/utils/timingConstruct'
import { urlParse, parseTime } from '@/utils'
import { getDangerList, getSysTime, getMonitorByTime } from '@/api/bridgeInfo'

import lineChart from '../lineChart/LineChart'
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
    lineChart,
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
      currentTime: '',
      sysTime: '',
      jishiTime: null,
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
        this.getSysTime()
        this.getDangerList()
      }
    }
  },
  methods: {
    getDangerList() {
      var arr = this.serverSeqArr
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
    getSysTime() {
      getSysTime().then(res => {
        if (res.success) {
          this.sysTime = res.data + (8 * 60 * 60 * 1000)
          this.first_Q = true
          this.getTimingMonitor()
        }
      })
    },
    formatTime(time) {
      var d = new Date()
      d.setTime(time)
      d = JSON.stringify(d).replace(/[^\d]/g, '').substring(0, 14)
      return d
    },
    getTimingMonitor() {
      var that = this
      var preTime = 2 * 1000
      var arr = this.serverSeqArr
      var startTime = this.formatTime(this.first_Q ? (this.sysTime - preTime) : this.sysTime)
      var endTime = this.formatTime(this.sysTime)
      getMonitorByTime({ seq: arr, begin: startTime, end: endTime }).then(res => {
        var mCache = that.monitorCache
        var mList = []
        if (res.success && res.data) {
          if (that.first_Q) {
            if (res.data.length) {
              that.first_Q = false
              var ftime = res.data[0].ctime
              monModel.construct(mCache, res.data)

              var f_q_t = that.sysTime - preTime

              for (;;) {
                var fts = that.formatTime(f_q_t)
                var ftsE = that.formatTime(f_q_t + 500)
                if (fts >= ftime) {
                  if (fts > that.sysTime) {
                    monModel.setData(mCache, res.data, fts, ftsE, null)
                  }
                }
                f_q_t += 1000
                if (f_q_t > that.sysTime) {
                  break
                }
              }
              for (let l = 0; l < mCache.length; ++l) {
                mList.push(mCache[l].cd)
              }
            }
          } else {
            var xtime = that.formatTime(that.sysTime)
            var xtimeE = that.formatTime(that.sysTime + 500)

            monModel.setData(mCache, res.data, xtime, xtimeE, that.maxShowLength)
            for (let l = 0; l < mCache.length; ++l) {
              mList.push(mCache[l].cd)
            }
          }
          that.monitorList = mList
          that.sysTime += 1000
          that.jishiTime = setTimeout(function() {
            that.getTimingMonitor()
          }, 1000)
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
    alarmShow(id, flag, time, msg) {
      this.$router.replace({
        name: 'dangerDetail',
        query: { aid: id, msg: msg, _t: time, flag: flag }
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
    clearTimeout(this.jishiTime)
  }
}
</script>
