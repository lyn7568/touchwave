<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="采集盒编号" v-model="listQuery.code">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="所属服务器编号" v-model="listQuery.scode">
      </el-input>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加采集盒</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="150px" align="center" label="采集盒编号" prop="code"></el-table-column>
      <el-table-column width="150px" align="center" label="内部编号" prop="seq"></el-table-column>
      <el-table-column width="150px" align="center" label="采集盒信道数量" prop="channels"></el-table-column>
      <el-table-column min-width="150px" align="center" label="所属服务器编号" prop="serverName"></el-table-column>
      <el-table-column min-width="200px" align="center" label="备注信息" prop="remark"></el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button v-waves v-waves type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button v-waves size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="采集盒配置" ref="ruleForm" :visible.sync="dialogTableVisible" width="860px" @close='closed'>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="form-main" label-position='right' status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集盒编号"  prop="code">
              <el-input placeholder="请输入采集盒编号" v-model="ruleForm2.code" maxlength=20></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集盒信道数量" prop="channels">
              <el-input placeholder="请输入采集盒信道数量" v-model="ruleForm2.channels" maxlength=10></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="所属服务器编号" prop="server">
              <el-autocomplete
                v-model="ruleForm2.server"
                :fetch-suggestions="querySearchAsync"
                placeholder="请选择所属服务器编号"
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内部编号" prop="seq">
              <el-input placeholder="请输入内部编号" v-model="ruleForm2.seq" maxlength=10></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="24" >
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" maxlength=500 v-model="ruleForm2.remark" rows=4></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="24" class="el-btn-col">
            <div class="el-btn-col-box">
              <el-button v-waves type="primary" @click="submitForm('ruleForm2')">确认</el-button>
              <el-button v-waves type="info" @click="resetForm('ruleForm2')">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-size="listQuery.pageSize" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { addDevice, updateDevice, deleteDevice, pageQueryDevice, DeviceOfservice, checkDeviceCode, checkDeviceInternalCode } from '@/api/collectionbox'
import waves from '@/directive/waves'
import queryBase from '@/utils/queryBase'
export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var server = (rule, value, callback) => {
      const that = this
      setTimeout(function() {
        if (that.ruleForm2.server === '' || that.ruleForm2.serverId === '') {
          callback(new Error('请选择服务器编号'))
        } else {
          callback()
        }
      }, 300)
    }
    var seq = (rule, value, callback) => {
      const num = /^[0-9]*$/
      if (value === '') {
        callback(new Error('请输入内部编号'))
      } else {
        if (!this.ruleForm2.serverId) {
          callback('请先选择所属服务器编号')
          return
        }
        if (!num.test(value)) {
          callback('请输入数字')
          return
        }
        if (this.edit) {
          checkDeviceInternalCode({ seq: value, id: this.edit, serverId: this.ruleForm2.serverId, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('内部编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceInternalCode({ seq: value, serverId: this.ruleForm2.serverId, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('内部编号已存在，请重新输入'))
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
          checkDeviceCode({ code: value, id: this.edit, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('采集盒编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceCode({ code: value, active: 1 }).then(response => {
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
              if (response.success) {
                this.getList()
                setTimeout(function() {
                  that.pop('已成功添加采集盒')
                }, 1000)
                this.resetForm('ruleForm2')
                this.dialogTableVisible = false
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            const par = this.ruleForm2
            par.id = this.edit
            updateDevice(par).then(response => {
              if (response.success) {
                setTimeout(function() {
                  that.pop('已成功更新采集盒')
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
      this.edit = ''
    },
    closed() {
      this.$refs['ruleForm2'].resetFields()
      this.edit = ''
    },
    getList() {
      var that = this
      this.listLoading = true
      pageQueryDevice(this.listQuery).then(response => {
        if (response.success) {
          const $data = response.data.data
          var hdata = { num: 1, data: $data }
          for (let i = 0; i < $data.length; i++) {
            hdata.num++
            const str = $data[i]
            queryBase.getServer(str.serverId, function(sc, value) {
              if (sc) {
                str.serverName = value.code
                hdata.num--
                if (hdata.num === 0) {
                  that.list = hdata.data
                }
              }
            })
          }
          hdata.num--
          if (hdata.num === 0) {
            that.list = hdata.data
          }
          that.total = response.data.total
          setTimeout(() => {
            that.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('确定要删除:采集盒' + row.code + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteDevice({ id: row.id }).then(response => {
          if (response.success) {
            this.getList()
            this.pop('已成功删除该采集盒')
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
      const that = this
      setTimeout(function() {
        that.resetTemp(row)
      }, 500)
      this.dialogTableVisible = true
    },
    querySearchAsync(queryString, cb) {
      this.ruleForm2.serverId = ''
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        DeviceOfservice({ code: this.ruleForm2.server, active: 1 }).then(response => {
          const $info = response.data
          if ($info.length) {
            const $data = $info.map(item => {
              return { 'value': item.code, 'id': item.id }
            })
            cb($data)
            if ($info.length === 1 && this.ruleForm2.server === $info[0].code) {
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
  .el-form-item{
    margin: 0px 10px
  }
  .el-select{
    width: 100%
  }
  .el-col{
    margin-bottom: 15px
  }
  .el-form-item__label{
    padding: 0px
  }
</style>