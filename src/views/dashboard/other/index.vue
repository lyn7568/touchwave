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
  getBridgeServers,
  getBridgeList,
  getBridgeUnread
} from '@/api/bridgeInfo'
import '@/styles/roleuser.scss'

export default {
  data() {
    return {
      alarmNum: 0,
      total: 0,
      pageSize: 10,
      pageNo: 1,
      dataList: [],
      bridgeList: [],
      serverList: [],
      serverSeqArr: [],
      deviceList: [],
      transducerList: []
    }
  },
  created() {
    this.getBridgeLists()
  },
  components: {
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
          if (res.data.data.length > 0) {
            this.total = res.data.total
            this.getBridgeServers(res.data.data)
          }
        }
      })
    },
    getBridgeServers($data) {
      var that = this
      for (let i = 0; i < $data.length; i++) {
        (function(i) {
          const param = {
            active: 1,
            id: $data[i].id
          }
          getBridgeServers(param).then(res => {
            if (res.success) {
              console.log(res)
              var serverSeqArr = []
              if (res.data.length > 0) {
                for (let j = 0; j < res.data.length; j++) {
                  serverSeqArr.push(res.data[j].seq)
                }
                that.getBridgeUnread($data[i], serverSeqArr)
              }
            }
          })
        })(i)
      }
      this.dataList = $data
      console.log(this.dataList)
    },
    getBridgeUnread($data, $arr) {
      var that = this
      const param = {
        server: $arr
      }
      var alarmNum = 0
      getBridgeUnread(param).then(res => {
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
    },
    goToDashboardC(id, name) {
      this.$router.push({
        path: '/bridgeDetail',
        query: { id: id, name: name }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getBridgeLists()
    }
  }
}
</script>
