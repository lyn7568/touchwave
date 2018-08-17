<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card block-group">
      <div slot="header" class="block-title">
        <span>报警信息</span>
      </div>
      <ul class="item-ul">
        <li :class="!item.readed ? 'readed-li' : ''" v-for="item in dangerShowList" :key="item.index" @click="alarmShow(item.aid, item.device)">
          <span>{{item.alarmTime}}</span>
          <span>{{item.device}}，请点击查看。</span>
          <span class="svg-container" v-if="!item.readed">
            <svg-icon icon-class="unread"></svg-icon>
          </span>
        </li>
      </ul>
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
import '@/styles/roleuser.scss'
import { urlParse, parseTime } from '@/utils'
import { getDangerList } from '@/api/bridgeInfo'

export default {
  data() {
    return {
      bridgeName: '',
      dangerList: [],
      total: 0,
      pageSize: 4,
      pageNo: 1
    }
  },
  computed: {
    dangerShowList() {
      return this.dangerList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  created() {
    this.bridgeName = urlParse('name')
    this.getDangerList()
  },
  methods: {
    getDangerList() {
      const param = {
        pageSize: 18,
        pageNo: 1
      }
      getDangerList(param).then(res => {
        if (res.success && res.data.data) {
          const dataS = res.data.data
          this.total = res.data.total
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
    alarmShow(id, msg) {
      this.$router.push({
        name: 'dangerDetail',
        query: { aid: id, msg: msg }
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.item-ul{
  min-height: 400px;
}
</style>
