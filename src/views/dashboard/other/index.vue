<template>
  <div class="dashboard-editor-container">
    <div v-if="!showComp">
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
    <div class="defaut-container" v-if="showComp">
      <div>
        <img class="plat-pic" src="/static/touchwave.png" width="460">
        <p class="plat-tit">欢迎 <span>{{name}}</span> 使用声脉桥梁云监控平台</p>
        <p class="plat-tip">您目前没有任何桥梁数据，请联系管理员</p>
      </div>
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      alarmNum: 0,
      total: 0,
      pageSize: 10,
      pageNo: 1,
      dataList: [],
      showComp: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
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
          } else {
            this.showComp = true
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
      this.$router.push({ name: 'bridgeHome' })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getBridgeLists()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.defaut-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100%;
  padding: 12% 0;
  background: #fff;
  .plat-pic{
    margin: 40px auto 0;
  }
  .plat-tit{
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 2px;
    span{
      color: #0f76c4;
    }
  }
  .plat-tip{
    font-size: 26px;
    line-height: 20px;
    letter-spacing: 2px;
    color: #f90000;
  }
}
</style>
