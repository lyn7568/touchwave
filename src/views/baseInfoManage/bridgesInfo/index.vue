<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="桥梁编号" v-model="listQuery.code">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="桥梁简称" v-model="listQuery.name">
      </el-input>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加桥梁</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="150px" align="center" label="桥梁编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="桥梁简称">
        <template slot-scope="scope">
          <span>{{scope.row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="桥梁位置">
        <template slot-scope="scope">
          <span>{{citys[scope.row.addrCode]}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="维护机构">
        <template slot-scope="scope">
          <span>{{scope.row.org}}</span>
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
    <el-dialog title="桥梁信息" ref="ruleForm" :visible.sync="dialogTableVisible" width="860px" @close='closed'>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="form-main"  label-position='top' status-icon>
        <el-row :gutter="10">
          <el-col :xs="16" :sm="16" :lg="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="桥梁编号" prop="code">
                  <el-input placeholder="请输入桥梁编号" v-model="ruleForm2.code" maxlength=20></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="桥梁简称" prop="shortName">
                  <el-input placeholder="请输入桥梁简称" v-model="ruleForm2.shortName" maxlength=20></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="桥梁全称" prop="name">
                  <el-input placeholder="请输入桥梁全称" v-model="ruleForm2.name" maxlength=200></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="桥梁位置信息" prop="addrCode">
                  <!-- <city @paren="toshow" :addrCode='ruleForm2.addrCode'></city> -->
                  <CityPicker @paren="toshow" :addrCode='ruleForm2.addrCode'></CityPicker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地理位置信息" prop="location">
                  <el-input placeholder="请输入地理位置信息" v-model="ruleForm2.location" maxlength=200></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="桥梁开通日期" prop="serviceDay">
                  <el-date-picker
                    value-format='yyyyMMdd'
                    v-model="ruleForm2.serviceDay"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="维护机构" prop="org">
                  <el-input placeholder="请输入维护机构" v-model="ruleForm2.org" maxlength=200></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input placeholder="请输入联系电话" v-model="ruleForm2.phone" maxlength=20></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电邮" prop="email">
                  <el-input placeholder="请输入联系电邮" v-model="ruleForm2.email" maxlength=100></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="8">
              <el-upload
                class="avatar-uploader"
                action="/ajax/bridge/upload"
                accept='image'
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            <p style="width:100%;text-align:center;font-size:14px;color:#999;">上传桥梁图片<br>
                JPEG/JPG/PNG格式大小5M以内</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详细描述" class="el-to-block" prop="descp">
              <el-input type="textarea" maxlength=500  rows=6 v-model="ruleForm2.descp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" class="el-to-block" prop="remark">
              <el-input type="textarea" maxlength=500 rows=3 v-model="ruleForm2.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el-btn-col">
            <div class="el-btn-col-box">
              <el-button v-waves type="primary" @click="submitForm('ruleForm2')">确认</el-button>
              <el-button v-waves type="primary" @click="resetForm('ruleForm2')">返回</el-button>
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
import { addDevice, updateDevice, deleteDevice, pageQueryDevice, checkDeviceCode, checkBridgeShortName, checkBridgeName } from '@/api/bridge'
import waves from '@/directive/waves'
import CityPicker from '@/components/CityPicker'
import queryDict from '@/utils/queryDict'
export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    var code = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入桥梁编号'))
      } else {
        if (this.edit) {
          checkDeviceCode({ code: value, id: this.edit, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkDeviceCode({ code: value, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁编号已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    var shortName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入桥梁简称'))
      } else {
        if (this.edit) {
          checkBridgeShortName({ shortName: value, id: this.edit, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁简称已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkBridgeShortName({ shortName: value, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁简称已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    var name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入桥梁全称'))
      } else {
        if (this.edit) {
          checkBridgeName({ name: value, id: this.edit, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁全称已存在，请重新输入'))
            } else {
              callback()
            }
          })
        } else {
          checkBridgeName({ name: value, active: 1 }).then(response => {
            if (response.data) {
              callback(new Error('桥梁全称已存在，请重新输入'))
            } else {
              callback()
            }
          })
        }
      }
    }
    return {
      citys: {},
      edit: '',
      imageUrl: '',
      ruleForm2: {
        code: '',
        shortName: '',
        name: '',
        addrCode: '',
        serviceDay: '',
        location: '',
        descp: '',
        remark: '',
        img: '',
        org: '',
        phone: '',
        email: ''
      },
      rules2: {
        code: [
          { required: true, validator: code, trigger: 'blur' }
        ],
        shortName: [
          { required: true, validator: shortName, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入地理位置信息', trigger: 'blur' }
        ],
        org: [
          { required: true, message: '请输入维护机构名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        addrCode: [
          { required: true, message: '请选择桥梁位置信息', trigger: 'blur' }
        ]
      },
      timeout: null,
      dialogTableVisible: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        name: '',
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
  components: {
    CityPicker
  },
  methods: {
    getDictoryData() {
      const that = this
      queryDict.applyDict('XZQH', function(dictData) {
        dictData.map(item => {
          that.citys[item.code] = item.fullCaption
        })
        that.getList()
      }) // 城市级联
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm2.img === '') {
            this.ruleForm2.img = '/default-bridge.jpg'
          }
          if (!this.edit) {
            addDevice(this.ruleForm2).then(response => {
              if (response.success) {
                this.getList()
                setTimeout(function() {
                  that.pop('已成功添加桥梁')
                }, 1000)
                this.resetForm('ruleForm2')
                this.ruleForm2.img = ''
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
                  that.pop('已成功更新桥梁')
                }, 1000)
                this.resetForm('ruleForm2')
                this.getList()
                this.dialogTableVisible = false
                this.edit = ''
                this.ruleForm2 = {
                  code: '',
                  shortName: '',
                  name: '',
                  addrCode: '',
                  serviceDay: '',
                  location: '',
                  descp: '',
                  remark: '',
                  img: '',
                  org: '',
                  phone: '',
                  email: ''
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
      this.imageUrl = ''
      this.edit = ''
    },
    closed() {
      this.$refs['ruleForm2'].resetFields()
      this.edit = ''
      this.imageUrl = ''
    },
    getList() {
      this.listLoading = true
      pageQueryDevice(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data.data
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
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
      this.$confirm('确定要删除:桥梁' + row.code + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteDevice({ id: row.id }).then(response => {
          if (response.success) {
            this.getList()
            this.pop('已成功删除该桥梁')
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
        shortName: row.shortName,
        name: row.name,
        addrCode: row.addrCode,
        serviceDay: row.serviceDay,
        location: row.location,
        descp: row.descp,
        remark: row.remark,
        img: row.img,
        org: row.org,
        phone: row.phone,
        email: row.email
      }
      this.edit = row.id
    },
    handleCreate() {
      this.dialogTableVisible = true
      this.ruleForm2.img = ''
    },
    handleUpdate(row) {
      const that = this
      setTimeout(function() {
        that.resetTemp(row)
        that.imageUrl = '/data/bridge' + row.img
      }, 500)
      this.dialogTableVisible = true
    },
    handleSelect(item) {
      this.ruleForm2.deviceId = item.id
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.ruleForm2.img = res.data[0].uri
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG && !isPNG) {
        this.$message.error('图片过大或格式不对请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('图片过大或格式不对请重新上传')
      }
      return (!isJPG || !isPNG) && isLt2M
    },
    toshow(value) {
      this.ruleForm2.addrCode = value
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
  .avatar-uploader{
    border: 1px dashed #409EFF;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 260px;
    height: 260px;
    line-height: 260px;
    text-align: center;
  }
  .avatar {
    width: 260px;
    height: 260px;
    display: block;
  }
  .el-autocomplete{
    display: block
  }
  .el-btn-col{
    margin-top: 45px
  }
  .el-form-item{
    margin: 0px 10px
  }
  .el-select,.el-date-editor--date{
    width: 100%
  }
  .el-col{
    margin-bottom: 15px
  }
  .el-form--label-top .el-form-item__label{
    line-height: 20px
  }
</style>