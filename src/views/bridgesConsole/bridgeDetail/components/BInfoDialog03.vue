<template>
  <el-dialog title="采集盒信息" :visible.sync="dialogTableVisible" :width="dialogW">
    <el-form class="form-main">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in deviceShowList" :key="item.index">
          <div class="list-item">
            <el-row>
              <el-col :span="12">
                <el-form-item label="采集盒编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采集盒信道数量">{{item.channels}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采集盒所属服务器编号">{{item.serverCode}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" class="el-to-block"><br />
                  <div class="textarea-div">{{item.remark}}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
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

export default {
  props: {
    deviceList: {
      type: Array
    }
  },
  data() {
    return {
      dialogW: '',
      dialogTableVisible: false,
      pageSize: 4,
      pageNo: 1
    }
  },
  created() {
    this.dialogW = this.$parent.dialogW
  },
  computed: {
    deviceShowList() {
      return this.deviceList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
    }
  }
}
</script>
