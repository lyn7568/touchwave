<template>
  <el-dialog title="用户数据权限修改" :visible.sync="dialogTableVisible" width="860px" @close='closed'>
    <el-form class="form-main" :model="ruleForm2"  ref="ruleForm2">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="list-item">
            <el-row>
              <el-col :span="8">
                <el-form-item label="账号">{{ruleForm2.account}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户姓名">{{ruleForm2.name}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户类型">{{(ruleForm2.type) ? '管理员' : '普通用户'}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职位">{{ruleForm2.job}}</el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="所属机构">{{ruleForm2.comp}}</el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
<!--         <el-col :xs="12" :sm="12" :lg="12">
          <div class="list-item">
            <el-row>
              <el-col :span="24">
                <el-form-item label="添加负责桥梁">
                  <el-autocomplete
                    v-model="state4"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请选择一个桥梁"
                    @select="handleSelect">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="margin-top:30px"> 
                 <el-table
                  :show-header="shouHead"
                  :data="tableData3"
                  height="250"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label=""
                    min-width="180">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="">
                    <template slot-scope="scope">  
                      <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col> -->
        <el-col :xs="24" :sm="24" :lg="24">
          <el-transfer class="check-transfer"
            filterable
            v-model="valueBridge"
            :titles="['所有桥梁', '负责桥梁']"
            :button-texts="['删除', '添加']"
            :props="{
              key: 'id',
              label: 'value'
            }"
            :data="bridgeLists">
          </el-transfer>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="submit">确认</el-button>
            <el-button type="info"  @click="closed">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { queryRegister, queryResponsibleBridge, DeviceOfservice, updatePermission } from '@/api/userManagemen'
export default {
  props: ['dialog', 'id'],
  data() {
    return {
      bridgeLists: [],
      bridgeListsChecked: [],
      valueBridge: [],
      shouHead: false,
      state4: '',
      ruleForm2: {
        account: '',
        name: '',
        comp: '',
        job: '',
        type: 0
      },
      dialogTableVisible: false
    }
  },
  created() {
    this.getAllBridges()
  },
  watch: {
    dialog() {
      queryRegister({ id: this.id }).then(response => {
        if (response.success) {
          const $data = response.data
          this.ruleForm2 = {
            account: $data.account,
            name: $data.name,
            comp: $data.comp,
            job: $data.job,
            type: $data.type
          }
        }
      })
      queryResponsibleBridge({ uid: this.id, active: 1 }).then(response => {
        if (response.success) {
          const $info = response.data
          for (let j = 0; j < $info.length; j++) {
            this.valueBridge.push($info[j].id)
          }
        }
      })
      this.dialogTableVisible = true
    }
  },
  methods: {
    getAllBridges() {
      DeviceOfservice({ key: this.state4, active: 1 }).then(response => {
        if (response.success) {
          const $info = response.data
          if ($info.length) {
            this.bridgeListsChecked.push($info[0].id)
            const $data = $info.map(item => {
              return { 'value': item.shortName, 'id': item.id }
            })
            this.bridgeLists = $data
          }
        }
      })
    },
    pop($par) {
      this.$confirm($par, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false,
        center: true
      }).then(() => {

      }).catch(() => {

      })
    },
    closed() {
      this.valueBridge = []
      this.dialogTableVisible = false
    },
    submit() {
      if (!this.valueBridge.length) {
        this.$message.error('请至少选择一个桥梁')
        return
      }
      updatePermission({ id: this.id, bridges: this.valueBridge }).then(response => {
        if (response.success) {
          this.valueBridge = []
          this.$emit('chilF')
          const that = this
          setTimeout(function() {
            that.pop('权限修改成功')
          }, 1000)
          this.dialogTableVisible = false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form-item{
    margin-bottom: 10px;
  }
  .textarea-div{
    line-height: 26px;
    margin-bottom: 10px;
  }
  .list-item{
    padding: 10px 15px;
  }
  .el-autocomplete {
    width: 100%
  }
  .check-transfer.el-transfer{
    padding-left: 15px;
    margin-bottom: 15px;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center
  }
  .check-transfer .el-transfer-panel{
    width: 240px;
  }
</style>