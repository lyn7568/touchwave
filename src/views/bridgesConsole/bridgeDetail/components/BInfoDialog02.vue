<template>
  <el-dialog title="采集服务器信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in serverShowList" :key="item.index">
          <div class="list-item">
            <el-row>
              <el-col :span="12">
                <el-form-item label="服务器编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采集器数量">{{item.devices}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属桥梁">{{bridgeName}}</el-form-item>
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

export default {
  props: {
    serverList: {
      type: Array
    },
    bridgeName: {
      type: String
    }
  },
  data() {
    return {
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
    }
  }
}
</script>
