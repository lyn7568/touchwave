<template>
  <el-dialog title="采集盒信息" :visible.sync="dialogTableVisible" :width="dialogW">
    <el-form class="form-main" label-width="114px" label-position="left">
      <el-row :gutter="16" v-if="deviceList.length">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in deviceShowList" :key="item.index">
          <div class="list-item">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="采集盒编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属服务器编号">{{item.serverCode}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信道数量">{{item.channels}}</el-form-item>
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
      <DefaultPage v-if="!deviceList.length"></DefaultPage>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="deviceList.length">
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
      dialogW: this.$parent.dialogW,
      deviceList: this.$parent.deviceList,
      dialogTableVisible: false,
      pageSize: 4,
      pageNo: 1
    }
  },
  computed: {
    deviceShowList() {
      return this.deviceList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
    },
    queryDeviceList() {
      this.deviceList = queryInfo.queryDevices(this.$parent.bridgeId)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.form-main .list-item{
  height: 226px;
}
</style>
