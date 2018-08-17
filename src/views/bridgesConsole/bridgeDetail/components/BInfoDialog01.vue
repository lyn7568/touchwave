<template>
  <el-dialog title="桥梁信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="18" :lg="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="桥梁编号">{{dataInfo.code}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁简称">{{dataInfo.shortName}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁全称">{{dataInfo.name}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁位置信息">{{dataInfo.addrCode}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地理位置信息">{{dataInfo.location}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁开通日期">{{dataInfo.serviceDay}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="维护单位">{{dataInfo.org}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电话">{{dataInfo.phone}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电邮">{{dataInfo.email}}</el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="6" :lg="8">
          <div style="width:100%">
            <img :src="dataInfo.img" :alt="dataInfo.shortName" width="90%">
          </div>
        </el-col>
        <el-col :span="24" v-if="dataInfo.descp">
          <el-form-item label="大桥描述" class="el-to-block"><br />
            <div class="textarea-div">{{dataInfo.descp}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="dataInfo.remark">
          <el-form-item label="备注" class="el-to-block"><br />
            <div class="textarea-div">{{dataInfo.remark}}</div>
          </el-form-item>
        </el-col>
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
import { getBridgeInfo } from '@/api/bridgeInfo'
import { parseTime } from '@/utils'

export default {
  props: {
    bridgeId: {
      type: String
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      dataInfo: ''
    }
  },
  created() {
    this.bridgeInfo()
  },
  methods: {
    bridgeInfo() {
      const param = {
        id: this.bridgeId
      }
      getBridgeInfo(param).then(res => {
        if (res.success) {
          res.data.serviceDay = parseTime(res.data.serviceDay)
          this.dataInfo = res.data
        }
      })
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
</style>