<template>
  <el-dialog title="桥梁信息" :visible.sync="dialogTableVisible" :width="dialogW">
    <el-form class="form-main">
      <el-row :gutter="10">
        <el-col :xs="14" :sm="14" :lg="14">
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
              <el-form-item label="桥梁位置信息">{{childCitys[dataInfo.addrCode]}}</el-form-item>
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
        <el-col :xs="10" :sm="10" :lg="10">
          <div style="width:100%">
            <img :src="'/data/bridge'+ dataInfo.img" :alt="dataInfo.shortName" width="100%">
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
  data() {
    return {
      dialogW: '',
      childCitys: {},
      dialogTableVisible: false,
      dataInfo: ''
    }
  },
  created() {
    this.bridgeInfo()
    this.callParent()
  },
  methods: {
    callParent() {
      this.childCitys = this.$parent.citys
      this.dialogW = this.$parent.dialogW
    },
    bridgeInfo() {
      const param = {
        id: this.$parent.bridgeId
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