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
          <div class="load-box" v-loading="loadprogress1">
            <ul class="item-ul" v-if="dangerList.length">
              <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerList" :key="item.index" @click="alarmShow(item.aid, item.readed, item.alarmTime, item.device)">
                <span>{{item.alarmTime}}</span>
                <span>{{item.device}}，请点击查看。</span>
                <span class="svg-container" v-if="!item.readed">
                  <svg-icon icon-class="unread"></svg-icon>
                </span>
              </li>
            </ul>
            <DefaultPage v-if="!dangerList.length && !loadprogress1"></DefaultPage>
          </div>
        </el-card>
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>实时监测</span>
            <el-button v-if="serverSeqArr.length" type="text" @click="updateDataList">刷新</el-button>
          </div>
          <div class="load-box" v-loading="loadprogress2">
            <el-row class="line-chart-box" v-if="monitorList.length">
              <el-col :xs="24" :sm="24" :lg="24" v-for="item in monitorShowList" :key="item.index">
                <lineChart :chartData="item" :maxXcount="maxShowLength"></lineChart>
              </el-col>
            </el-row>
            <DefaultPage v-if="!monitorList.length && !loadprogress2"></DefaultPage>
          </div>
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
import { urlParse, parseTime, isEqualArr } from '@/utils'
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
      loadprogress1: true,
      loadprogress2: true,
      bridgeId: '',
      bridgeName: '',
      dialogW: '860px',
      citys: {},
      cableMain: {},
      addr: {},
      dangerList: '',
      dangerAidArr: [],
      first_Dan: true,
      serverSeqArr: [],
      transducerList: [],
      currentNo: 1,
      currentSize: 4,
      currentTime: '',
      sysTime: '',
      localTimeiv: '',
      eastEightDistrict: 8 * 60 * 60 * 1000,
      maxShowLength: 300,
      monitorList: [],
      monitorCache: [],
      jishiTime: '',
      jishiTime2: ''
    }
  },
  computed: {
    monitorShowList() {
      return this.monitorList.slice((this.currentNo - 1) * this.currentSize, this.currentNo * this.currentSize)
    }
  },
  created() {
    var that = this
    if (this.jishiTime) {
      clearTimeout(this.jishiTime)
    }
    if (urlParse('id')) {
      that.bridgeId = urlParse('id')
      that.bridgeName = urlParse('name')
    } else {
      that.bridgeId = Cookies.get('bridgeId')
      that.bridgeName = Cookies.get('bridgeName')
    }
    that.getDictoryData()
    queryInfo.qaiCb(function() {
      if (that.bridgeId) {
        that.serverSeqArr = queryInfo.queryServers(that.bridgeId, true)
        that.transducerList = queryInfo.queryTrans(that.bridgeId)
        if (that.serverSeqArr.length) {
          that.updateDataList()
          that.getDangerList()
        }
      }
    })
  },
  methods: {
    updateDataList() {
      var that = this
      clearTimeout(that.jishiTime)
      that.jishiTime = ''
      that.sysTime = ''
      that.monitorList = []
      that.monitorCache = []
      if (that.transducerList.length) {
        monModel.construct(that.monitorCache, that.transducerList)
      }
      that.getSysTime()
    },
    getDangerList() {
      var that = this
      var arr = this.serverSeqArr
      const param = {
        seq: arr,
        pageSize: 5,
        pageNo: 1
      }
      if (that.first_Dan) {
        this.loadprogress1 = true
      }
      getDangerList(param).then(res => {
        var dCache = that.dangerAidArr
        var DList = []
        if (res.success && res.data.data) {
          const dataS = res.data.data
          if (that.first_Dan) {
            that.first_Dan = false
            for (let i = 0; i < dataS.length; i++) {
              dCache.push(dataS[i].aid)
              if (dataS[i].alarmTime) {
                dataS[i].alarmTime = parseTime(dataS[i].alarmTime, true)
              }
              dataS[i].device = `${this.bridgeName}大桥${dataS[i].device}采集盒检测到异常情况`
            }
            that.dangerList = dataS
          } else {
            for (let i = 0; i < dataS.length; i++) {
              DList.push(dataS[i].aid)
              if (dataS[i].alarmTime) {
                dataS[i].alarmTime = parseTime(dataS[i].alarmTime, true)
              }
              dataS[i].device = `${this.bridgeName}大桥${dataS[i].device}采集盒检测到异常情况`
            }
            if (!isEqualArr(DList, dCache)) {
              dCache = []
              dCache = DList
              that.dangerList = dataS
            }
          }
          that.loadprogress1 = false
          if (that && !that._isDestroyed) {
            that.jishiTime2 = setTimeout(function() {
              if (that && !that._isDestroyed) {
                that.getDangerList(param)
              }
            }, 5000)
          } else {
            that.jishiTime2 = ''
          }
        } else {
          that.loadprogress1 = false
        }
      })
    },
    getSysTime() {
      var that = this
      var arr = this.serverSeqArr
      getSysTime({ seq: arr }).then(res => {
        if (res.success) {
          if (res.data && res.data.length > 0) {
            const nowt = parseTime(res.data[0].ctime, true, true)
            that.sysTime = (new Date(nowt)).getTime() + that.eastEightDistrict - 2 * 1000
            that.first_Q = true
          } else {
            that.sysTime = (new Date()).getTime() + that.eastEightDistrict - 2 * 1000
            that.loadprogress2 = false
          }
          setTimeout(function() {
            const localTime = new Date().getTime() + that.eastEightDistrict
            that.localTimeiv = localTime - that.sysTime
            that.getTimingMonitor()
          }, 1)
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
      var arr = this.serverSeqArr
      var startTime = this.formatTime(this.sysTime)
      var endTime = this.formatTime(this.sysTime)
      that.sysTime += 1000
      getMonitorByTime({ seq: arr, begin: startTime, end: endTime }).then(res => {
        var mList = []
        if (res.success && res.data) {
          if (that.first_Q) {
            if (res.data.length) {
              that.first_Q = false
              that.loadprogress2 = false
              var ftime = res.data[0].ctime
              var f_q_t = that.sysTime

              for (;;) {
                var fts = that.formatTime(f_q_t)
                var ftsE = that.formatTime(f_q_t + 500)
                if (fts >= ftime) {
                  if (fts > that.sysTime) {
                    monModel.setData(that.monitorCache, res.data, fts, ftsE, null)
                  }
                }
                f_q_t += 1000
                if (f_q_t > that.sysTime) {
                  break
                }
              }
              for (let l = 0; l < that.monitorCache.length; ++l) {
                mList.push(that.monitorCache[l].cd)
              }
            }
          } else {
            var xtime = that.formatTime(that.sysTime)
            var xtimeE = that.formatTime(that.sysTime + 500)

            monModel.setData(that.monitorCache, res.data, xtime, xtimeE, that.maxShowLength)
            for (let l = 0; l < that.monitorCache.length; ++l) {
              mList.push(that.monitorCache[l].cd)
            }
          }
          that.monitorList = mList
          if (that && !that._isDestroyed) {
            var st = new Date().getTime() + that.eastEightDistrict - that.localTimeiv
            var iv = that.sysTime - st
            if (iv < 0) {
              iv = 1
            }
            that.jishiTime = setTimeout(function() {
              if (that && !that._isDestroyed) {
                that.getTimingMonitor()
              }
            }, iv)
          } else {
            that.jishiTime = ''
          }
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
      this.$refs.BInfoDialog02.queryServerList()
      this.$refs.BInfoDialog02.dialogTableVisible = true
    },
    queryBoxInfo() {
      this.$refs.BInfoDialog03.queryDeviceList()
      this.$refs.BInfoDialog03.dialogTableVisible = true
    },
    querySensorInfo() {
      this.$refs.BInfoDialog04.queryTransList()
      this.$refs.BInfoDialog04.dialogTableVisible = true
    },
    updatePersonInfo() {
      this.$refs.updatePersonInfo.getUserSelf()
      this.$refs.updatePersonInfo.dialogTableVisible = true
    },
    updateLoginPwd() {
      this.$refs.updateLoginPwd.dialogTableVisible = true
    }
  },
  beforeDestroy() {
    this.$once('hook:beforeDestroy', () => {
      clearTimeout(this.jishiTime)
      clearTimeout(this.jishiTime2)
    })
  }
}
</script>
