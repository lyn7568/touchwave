<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
        <span>报警信息</span>
      </div>
      <div class="load-box" v-loading="loadprogress">
        <ul class="item-ul" v-if="dangerList.length">
          <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerList" :key="item.index" @click="alarmShow(item.aid, item.readed, item.alarmTime, item.device)">
            <span>{{item.alarmTime}}</span>
            <span>{{item.device}}，请点击查看。</span>
            <span class="svg-container" v-if="!item.readed">
              <svg-icon icon-class="unread"></svg-icon>
            </span>
          </li>
        </ul>
        <DefaultPage v-if="!dangerList.length && !loadprogress"></DefaultPage>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>


<script>
import queryInfo from '@/utils/queryInfo'
import Cookies from 'js-cookie'
import { parseTime } from '@/utils'
import { getDangerList } from '@/api/bridgeInfo'

import DefaultPage from '@/components/DefaultPage'

export default {
  components: {
    DefaultPage
  },
  data() {
    return {
      bridgeId: '',
      bridgeName: '',
      loadprogress: true,
      dangerList: [],
      pageSize: 20,
      pageNo: 1,
      total: 0
    }
  },
  created() {
    var that = this
    that.bridgeId = Cookies.get('bridgeId')
    that.bridgeName = Cookies.get('bridgeName')
    queryInfo.qaiCb(function() {
      if (that.bridgeId) {
        that.serverSeqArr = queryInfo.queryServers(that.bridgeId, true)
        if (that.serverSeqArr.length) {
          that.getDangerList()
        }
      }
    })
  },
  methods: {
    getDangerList() {
      var that = this
      var arr = this.serverSeqArr
      const param = {
        seq: arr,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      that.loadprogress = true
      getDangerList(param).then(res => {
        if (res.success && res.data.data) {
          that.loadprogress = false
          const dataS = res.data.data
          that.total = res.data.total
          for (let i = 0; i < dataS.length; i++) {
            if (dataS[i].alarmTime) {
              dataS[i].alarmTime = parseTime(dataS[i].alarmTime, true)
            }
            dataS[i].device = `${that.bridgeName}大桥${dataS[i].device}采集盒检测到异常情况`
          }
          that.dangerList = dataS
        }
      })
    },
    alarmShow(id, flag, time, msg) {
      this.$router.replace({
        name: 'dangerDetail',
        query: { aid: id, msg: msg, _t: time, flag: flag }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getDangerList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-ul{
  min-height: 400px;
}
</style>
