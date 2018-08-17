<template>
  <el-dialog title="用户数据权限修改" :visible.sync="dialogTableVisible" width="80%" @close='closed'>
    <el-form class="form-main" :model="ruleForm2"  ref="ruleForm2">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="list-item">
            <el-row>
              <el-col :span="12">
                <el-form-item label="账号">{{ruleForm2.account}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户姓名">{{ruleForm2.name}}</el-form-item>
              </el-col>
              <el-col :span="12"  style='margin-top:30px'>
                <el-form-item label="用户类型">{{(ruleForm2.type) ? '管理员' : '普通用户'}}</el-form-item>
              </el-col>
              <el-col :span="12" style='margin-top:30px'>
                <el-form-item label="职位">{{ruleForm2.job}}</el-form-item>
              </el-col>
              <el-col :span="24" style='margin-top:30px'>
                <el-form-item label="所属机构">{{ruleForm2.comp}}</el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
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
        </el-col>
      </el-row>
      <el-row>
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
      arr: [],
      shouHead: false,
      state4: '',
      ruleForm2: {
        account: '',
        name: '',
        comp: '',
        job: '',
        type: 0
      },
      tableData3: [],
      timeout: null,
      dialogTableVisible: false
    }
  },
  watch: {
    dialog() {
      this.dialogTableVisible = true
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
      queryResponsibleBridge({ uid: this.id }).then(response => {
        if (response.success) {
          const $info = response.data
          for (let j = 0; j < $info.length; j++) {
            this.tableData3.push({ name: $info[j].shortName, address: $info[j].id })
          }
        }
      })
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        DeviceOfservice({ key: this.state4, active: 1 }).then(response => {
          const $info = response.data
          if ($info.length) {
            const $data = $info.map(item => {
              return { 'value': item.shortName, 'id': item.id }
            })
            cb($data)
          } else {
            cb([])
          }
        })
      }, 3000 * Math.random())
    },
    handleSelect(item) {
      this.state4 = ''
      let flag = false
      for (let i = 0; i < this.tableData3.length; i++) {
        if (item.id === this.tableData3[i].address) {
          flag = true
          break
        }
      }
      if (!flag) {
        const $data = { name: item.value, address: item.id }
        this.tableData3.push($data)
      }
    },
    handleModifyStatus(value) {
      const index = this.tableData3.indexOf(value)
      this.tableData3.splice(index, 1)
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
      this.tableData3 = []
      this.arr = []
      this.dialogTableVisible = false
    },
    submit() {
      this.tableData3.map(item => {
        this.arr.push(item.address)
      })
      updatePermission({ id: this.id, bridges: this.arr }).then(response => {
        if (response.success) {
          this.tableData3 = []
          this.arr = []
          this.$emit('chilF')
          const that = this
          setTimeout(function() {
            that.pop('权限修改修改成功')
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
    margin: 0;
  }
  .textarea-div{
    line-height: 26px;
    margin-bottom: 10px;
  }
  .list-item{
    
    margin-bottom: 20px;
    padding: 10px 15px;
  }
</style>