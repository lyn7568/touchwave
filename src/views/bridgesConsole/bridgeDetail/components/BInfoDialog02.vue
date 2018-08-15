<template>
  <el-dialog title="采集服务器信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in [0,1,2,3]" :key="item.id">
          <div class="list-item">
            <el-row>
              <el-col :span="12">
                <el-form-item label="服务器编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采集器数量">{{item.devices}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属桥梁">{{item.bridgeId}}</el-form-item>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="4"
          layout="prev, pager, next, jumper"
          :total="10">
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

export default {
  data() {
    return {
      dialogTableVisible: false,
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form-item{
    margin: 0;
  }
  .textarea-div{
    line-height: 26px;
    margin-bottom: 10px;
  }
  .list-item{
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding: 10px 15px;
  }
</style>