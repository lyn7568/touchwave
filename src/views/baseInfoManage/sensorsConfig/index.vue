<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="采集盒编号" v-model="listQuery.cdCode">
      </el-input>
       <el-input style="width: 200px;" class="filter-item" placeholder="传感器编号" v-model="listQuery.code">
      </el-input>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加传感器</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="150px" align="center" label="传感器编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="传感器所在主缆">
        <template slot-scope="scope">
          <span>{{cableMain[scope.row.cableType]}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="传感器位置">
        <template slot-scope="scope">
          <span>{{addr[scope.row.locType]}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="所属采集盒编号">
        <template slot-scope="scope">
          <span>{{scope.row.deviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="备注信息">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button v-waves type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button v-waves size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="传感器配置" ref="ruleForm" :visible.sync="dialogTableVisible" width="860px" @close='closed'>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="form-main"  label-position='right' status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集盒编号" prop="device">
              <el-autocomplete
                 v-model="ruleForm2.device"
                :fetch-suggestions="querySearchAsync"
                placeholder="请选择采集盒编号"
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传感器编号" prop="code">
              <el-input placeholder="请输入传感器编号" v-model="ruleForm2.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内部编号" prop="seq">
              <el-input placeholder="请输入内部编号" v-model="ruleForm2.seq"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传感器所在主缆" prop="cableType">
              <el-select v-model="ruleForm2.cableType" placeholder="请选择主缆">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="传感器位置" prop="locType">
              <el-select v-model="ruleForm2.locType" placeholder="请选择主缆传感器位置">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" maxlength=100 v-model="ruleForm2.remark" rows=4></el-input>
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
import { addDevice, updateDevice, deleteDevice, pageQueryDevice, DeviceOfservice, checkDeviceCode, checkDeviceInternalCode, queryServer } from '@/api/sensor'
import waves from '@/directive/waves'
import queryDict from '@/utils/queryDict'
export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var device = (rule, value, callback) => {
      const that = this
      setTimeout(function() {
        if (that.ruleForm2.device === '' || that.ruleForm2.deviceId === '') {
          callback(new Error('请选择采集盒编号'))
        } else {
          callback()
        }
      }, 300)
    }
    var seq = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内部编号'))
      } else {
        if (!this.ruleForm2.deviceId) {
          callback('请先选择采集盒编号')
          return
        }
        if (this.edit) {
          checkDeviceInternalCode({ seq: value, id: this.edit, deviceId: this.ruleForm2.deviceId }).then(response => {
            if (response.data) {
              callback(new Error('内部编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceInternalCode({ seq: value, deviceId: this.ruleForm2.deviceId }).then(response => {
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
        callback(new Error('请输入传感器编号'))
      } else {
        if (this.edit) {
          checkDeviceCode({ code: value, id: this.edit }).then(response => {
            if (response.data) {
              callback(new Error('传感器编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceCode({ code: value }).then(response => {
            if (response.data) {
              callback(new Error('传感器编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    return {
      cableMain: [],
      addr: [],
      options: [],
      options1: [],
      edit: '',
      ruleForm2: {
        code: '',
        cableType: '01',
        device: '',
        seq: '',
        deviceId: '',
        locType: '01',
        remark: ''
      },
      rules2: {
        code: [
          { required: true, validator: code, trigger: 'blur' }
        ],
        device: [
          { required: true, validator: device, trigger: 'blur' }
        ],
        cableType: [
          { required: true, message: '请选择主缆', trigger: 'blur' }
        ],
        locType: [
          { required: true, message: '请选择传感器位置', trigger: 'blur' }
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
        cdCode: '',
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
    this.getDictoryData()
  },
  methods: {
    getDictoryData() {
      const that = this
      queryDict.applyDict('ZLLX', function(dictData) {
        dictData.map(item => {
          that.options.push({ value: item.code, label: item.caption })
          that.cableMain[item.code] = item.caption
        })
      }) // 主缆
      queryDict.applyDict('ZLWZ', function(dictData) {
        dictData.map(item => {
          that.options1.push({ value: item.code, label: item.caption })
          that.addr[item.code] = item.caption
        })
      }) // 位置
      that.getList()
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.edit) {
            addDevice(this.ruleForm2).then(response => {
              this.getList()
              setTimeout(function() {
                that.pop('已成功添加传感器')
              }, 1000)
              this.resetForm('ruleForm2')
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
                  cableType: '',
                  device: '',
                  seq: '',
                  deviceId: '',
                  locType: '',
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
      this.listLoading = true
      pageQueryDevice(this.listQuery).then(response => {
        const $data = response.data.data
        for (let i = 0; i < $data.length; i++) {
          $data[i].deviceName = ''
          queryServer({ id: $data[i].deviceId }).then(response => {
            this.list[i].deviceName = response.data.code
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
      this.$confirm('确实要删除:传感器' + row.code + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteDevice({ id: row.id }).then(response => {
          if (response.success) {
            this.getList()
            this.pop('已成功删除该传感器')
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
        cableType: row.cableType,
        device: row.deviceName,
        seq: row.seq,
        deviceId: row.deviceId,
        locType: row.locType,
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
      this.ruleForm2.deviceId = ''
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        DeviceOfservice({ code: this.ruleForm2.device }).then(response => {
          const $info = response.data
          if ($info.length) {
            const $data = $info.map(item => {
              return { 'value': item.code, 'id': item.id }
            })
            cb($data)
            if ($info.length === 1 && this.ruleForm2.bridge === $info[0].code) {
              this.ruleForm2.deviceId = $info[0].id
            } else {
              this.ruleForm2.deviceId = ''
            }
          } else {
            cb([])
          }
        })
      }, 3000 * Math.random())
    },
    handleSelect(item) {
      this.ruleForm2.deviceId = item.id
      this.ruleForm2.device = item.value
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