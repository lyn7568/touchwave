<template>
  <el-dialog title="传感器信息" :visible.sync="dialogTableVisible" :width="dialogW">
    <el-form class="form-main" label-width="114px" label-position="left">
      <el-row :gutter="16" v-if="transducerList.length">
        <el-col :xs="12" :sm="12" :lg="12" v-for="item in transducerShowList" :key="item.index">
          <div class="list-item">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="传感器编号">{{item.code}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属采集盒编号">{{item.deviceCode}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属主缆">{{childCableMain[item.cableType]}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属位置">{{childAddr[item.locType]}}</el-form-item>
              </el-col>
              <el-col :span="24">
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
      <DefaultPage v-if="!transducerList.length"></DefaultPage>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="transducerList.length">
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
      transducerList: [],
      childCableMain: this.$parent.cableMain,
      childAddr: this.$parent.addr,
      dialogTableVisible: false,
      pageSize: 4,
      pageNo: 1
    }
  },
  computed: {
    transducerShowList() {
      return this.transducerList.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
    },
    queryTransList() {
      var that = this
      queryInfo.qaiCb(function() {
        that.transducerList = queryInfo.queryTrans(that.$parent.bridgeId)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.form-main .list-item{
  height: 280px;
}
</style>
