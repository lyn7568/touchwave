<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="所属服务器编号" v-model="listQuery.title">
      </el-input>
       <el-input style="width: 200px;" class="filter-item" placeholder="采集盒编号" v-model="listQuery.importance">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加采集盒</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="150px" align="center" label="采集盒编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="采集盒信道数量">
        <template slot-scope="scope">
          <span>{{scope.row.channels}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="所属服务器编号">
        <template slot-scope="scope">
          <span>{{scope.row.serverName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="备注信息">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="采集盒配置" ref="ruleForm" :visible.sync="dialogTableVisible" width="680px">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="form-main" label-width="120px" label-position='right' status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集盒编号"  prop="code">
              <el-input placeholder="请输入采集盒编号" v-model="ruleForm2.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集盒信道数量" prop="channels">
              <el-input placeholder="请输入采集盒信道数量" v-model="ruleForm2.channels"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="所属服务器编号" prop="server">
              <el-autocomplete
                v-model="ruleForm2.server"
                :fetch-suggestions="querySearchAsync"
                placeholder="请选择服务器编号"
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内部编号" prop="seq">
              <el-input placeholder="请输入内部编号" v-model="ruleForm2.seq"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="24" >
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" maxlength=100 v-model="ruleForm2.remark" rows=4></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="24" class="el-btn-col">
            <div class="el-btn-col-box">
              <el-button type="primary" @click="submitForm('ruleForm2')">确认</el-button>
              <el-button type="info" @click="resetForm('ruleForm2')">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { addDevice, updateDevice, deleteDevice, pageQueryDevice, DeviceOfservice, checkDeviceCode, checkDeviceInternalCode, queryServer } from '@/api/collectionbox'
import waves from '@/directive/waves'
export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var server = (rule, value, callback) => {
      const that = this
      setTimeout(function() {
        if (value === '' || that.ruleForm2.serverId === '') {
          callback(new Error('请选择服务器编号'))
        } else {
          callback()
        }
      }, 300)
    }
    var seq = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内部编号'))
      } else {
        if (this.edit) {
          checkDeviceInternalCode({ seq: value, id: this.edit }).then(response => {
            if (response.data) {
              callback(new Error('采集盒编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceInternalCode({ seq: value }).then(response => {
            if (response.data) {
              callback(new Error('采集盒编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    var code = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入采集盒编号'))
      } else {
        if (this.edit) {
          checkDeviceCode({ code: value, id: this.edit }).then(response => {
            if (response.data) {
              callback(new Error('采集盒编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceCode({ code: value }).then(response => {
            if (response.data) {
              callback(new Error('采集盒编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    return {
      edit: '',
      ruleForm2: {
        code: '',
        channels: '',
        server: '',
        seq: '',
        serverId: '',
        remark: ''
      },
      rules2: {
        code: [
          { required: true, validator: code, trigger: 'blur' }
        ],
        channels: [
          { required: true, message: '请输入采集盒数量', trigger: 'blur' }
        ],
        server: [
          { required: true, validator: server, trigger: 'blur' }
        ],
        seq: [
          { required: true, validator: seq, trigger: 'blur' }
        ]
      },
      timeout: null,
      dialogTableVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        scode: '',
        code: '',
        active: 1,
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  filters: {
    typeFilter(type) {

    }
  },
  created() {
    this.getList()
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.edit) {
            addDevice(this.ruleForm2).then(response => {
              setTimeout(function() {
                that.pop('已成功添加传感器')
              }, 1000)
              this.resetForm(this.ruleForm2)
              this.getList()
              this.dialogTableVisible = false
            }).catch(error => {
              console.log(error)
            })
          } else {
            const par = this.ruleForm2
            par.id = this.edit
            updateDevice(par).then(response => {
              if (response.success) {
                setTimeout(function() {
                  that.pop('已成功更新传感器')
                }, 1000)
                this.resetForm('ruleForm2')
                this.getList()
                this.dialogTableVisible = false
                this.edit = ''
                this.ruleForm2 = {
                  code: '',
                  channels: '',
                  server: '',
                  seq: '',
                  serverId: '',
                  remark: ''
                }
              }
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.dialogTableVisible = false
      this.$refs[formName].resetFields()
      this.ruleForm2.mark = ''
    },
    getList() {
      this.listLoading = true
      pageQueryDevice(this.listQuery).then(response => {
        const $data = response.data.data
        for (let i = 0; i < $data.length; i++) {
          $data[i].serverName = ''
          queryServer({ id: $data[i].serverId }).then(response => {
            this.list[i].serverName = response.data.code
            this.$forceUpdate()
          })
        }
        this.list = $data
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      //  this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      //  this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      //  this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('确实要删除:采集盒' + row.code + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteDevice({ id: row.id }).then(response => {
          if (response.success) {
            this.getList()
            this.pop('已成功删除该传感器')
            /*  this.$message({
              type: 'success',
              message: '已成功删除该采集盒!'
            })  */
          }
        })
      }).catch(() => {

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
    resetTemp(row) {
      this.ruleForm2 = {
        code: row.code,
        channels: row.channels,
        server: row.serverName,
        seq: row.seq,
        serverId: row.serverId,
        remark: row.remark
      }
      this.edit = row.id
    },
    handleCreate() {
      this.dialogTableVisible = true
    },
    handleUpdate(row) {
      this.resetTemp(row)
      this.dialogTableVisible = true
    },
    querySearchAsync(queryString, cb) {
      if (queryString === '') {
        cb([])
        return
      }
      this.ruleForm2.serverId = ''
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        DeviceOfservice({ code: this.ruleForm2.bridge }).then(response => {
          const $info = response.data
          if ($info.length) {
            const $data = $info.map(item => {
              return { 'value': item.code, 'id': item.id }
            })
            cb($data)
            if ($info.length === 1 && this.ruleForm2.bridge === $info[0].code) {
              this.ruleForm2.serverId = $info[0].id
            } else {
              this.ruleForm2.serverId = ''
            }
          } else {
            cb([])
          }
        })
      }, 3000 * Math.random())
    },
    handleSelect(item) {
      this.ruleForm2.serverId = item.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-autocomplete{
    display: block
  }
  .el-btn-col{
    margin-top: 45px
  }
  .editTe{
    margin: 10px 0 0 22px
  }
</style>