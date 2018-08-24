<template>
  <div class="dashboard-editor-container">
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col" v-for="item in dataList" :key="item.index" @click.native="goToDashboardC(item.id, item.shortName)">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper">
            <div class="card-image" :style="{ backgroundImage: 'url(/data/bridge'+ item.img +')'}"></div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">桥梁名称 <span>{{item.shortName}}</span></div>
            <div class="card-panel-text" :class="item.alarmNum>0?'card-panel-text-red':''">未读报警 {{item.alarmNum ? item.alarmNum : alarmNum}}条</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="9"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getBridgeList,
  getBridgeUnread
} from '@/api/bridgeInfo'
import '@/styles/roleuser.scss'
import Cookies from 'js-cookie'
import queryInfo from '@/utils/queryInfo'

export default {
  data() {
    return {
      alarmNum: 0,
      total: 0,
      pageSize: 10,
      pageNo: 1,
      dataList: []
    }
  },
  created() {
    this.getBridgeLists()
  },
  methods: {
    getBridgeLists() {
      const param = {
        active: 1,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      getBridgeList(param).then(res => {
        if (res.success) {
          var $data = res.data.data
          if ($data.length > 0) {
            this.total = res.data.total
            for (let i = 0; i < $data.length; i++) {
              var svrs = queryInfo.queryServers($data[i].id, true)
              this.getBridgeUnread($data[i], svrs)
            }
            this.dataList = $data
          }
        }
      })
    },
    getBridgeUnread($data, svrs) {
      var that = this
      var alarmNum = 0
      if (svrs.length) {
        getBridgeUnread({ server: svrs }).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              for (let j = 0; j < res.data.length; j++) {
                alarmNum += res.data[j].num
              }
              $data.alarmNum = alarmNum
              that.$forceUpdate()
            }
          }
        })
      }
    },
    goToDashboardC(id, name) {
      Cookies.set('bridgeId', id)
      Cookies.set('bridgeName', name)
      this.$router.replace({ name: 'bridgeHome' })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getBridgeLists()
    }
  }
}
</script>
