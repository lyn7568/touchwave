<template>
  <el-dialog title="采集服务器信息" :visible.sync="dialogTableVisible" :width="dialogW">
    <el-form class="form-main" label-width="86px" label-position="left">
      <el-row :gutter="16" v-if="serverList.length">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in serverShowList" :key="item.index">
          <div class="list-item">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="服务器编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采集盒数量">{{item.devices}}</el-form-item>
              </el-col>
              <el-col :span="24"></el-col>
              <el-col :span="12">
                <el-form-item label="所属桥梁">{{bridgeName}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内部编号">{{item.seq}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" class="el-to-block">
                  <el-tooltip placement="bottom-end" effect="dark">
                    <div slot="content" class="popper-tips">{{item.remark}}</div>
                    <div class="textarea-div">{{item.remark}}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <DefaultPage v-if="!serverList.length"></DefaultPage>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="serverList.length">
        </el-pagination>
      </div>
      <el-row>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="dialogTableVisible=false">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import './style.scss'
import DefaultPage from '@/components/DefaultPage'
import queryInfo from '@/utils/queryInfo'

export default {
  components: {
    DefaultPage
  },
  data() {
    return {
      serverList: [],
      dialogW: this.$parent.dialogW,
      bridgeName: this.$parent.bridgeName,
      dialogTableVisible: false,
      pageSize: 4,
      pageNo: 1
    }
  },
  computed: {
    serverShowList() {
      return this.serverList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
    },
    queryServerList() {
      this.serverList = queryInfo.queryServers(this.$parent.bridgeId)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.form-main .list-item{
  height: 186px;
}
</style>
