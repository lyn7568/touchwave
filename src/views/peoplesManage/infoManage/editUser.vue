<template>
  <el-dialog title="编辑用户" ref="ruleForm" :visible.sync="dialogTableVisible" width="860px" @close='closed'>
     <el-form class="form-main" :model="ruleForm2" :rules="rules2" ref="ruleForm2"  label-position='top' status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop='account'>
              <el-input placeholder="请输入账号" v-model="ruleForm2.account" maxlength=11></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop='name'>
              <el-input placeholder="请输入用户姓名" v-model="ruleForm2.name"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="职位" prop='job'>
              <el-input placeholder="请输入用户职位" v-model="ruleForm2.job"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户类型" prop='type'>
              <el-select v-model="ruleForm2.type" placeholder="请选择用户类型">
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
            <el-form-item label="联系电话" prop='phone'>
              <el-input placeholder="请输入手机号码" v-model="ruleForm2.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop='email'>
              <el-input placeholder="请输入邮箱地址" v-model="ruleForm2.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在机构" prop='comp'>
              <el-input placeholder="请输入所在用户机构" v-model="ruleForm2.comp"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="24" >
            <el-form-item label="备注" prop='remark'>
              <el-input type="textarea" rows=4 v-model="ruleForm2.remark"></el-input>
             </el-form-item>
          </el-col>
          <el-col :span="24" class="el-btn-col">
            <div class="el-btn-col-box">
              <el-button type="primary" @click="submitForm('ruleForm2')">确认</el-button>
              <el-button type="info"  @click="resetForm('ruleForm2')">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
</template>

<script>
import { checkRegister, addRegister, updateRegister, queryRegister } from '@/api/userManagemen'
export default {
  props: ['dialog', 'id'],
  data() {
    var account = (rule, value, callback) => {
      const regTel = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (!regTel.test(value)) {
          callback(new Error('账号为手机号格式'))
        } else {
          if (this.edit) {
            checkRegister({ account: value, id: this.edit }).then(response => {
              if (!response.data) {
                callback(new Error('账户已存在，请重新输入'))
              } else {
                callback()
              }
            })
          } else {
            checkRegister({ account: value }).then(response => {
              if (!response.data) {
                callback(new Error('账户已存在，请重新输入'))
              } else {
                callback()
              }
            })
          }
        }
      }
    }
    var phone = (rule, value, callback) => {
      const regTel = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (value === '') {
        callback()
      } else {
        if (!regTel.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
    }
    var email = (rule, value, callback) => {
      const regTel = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value === '') {
        callback()
      } else {
        if (!regTel.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      options: [{
        value: 0,
        label: '普通用户'
      }, {
        value: 1,
        label: '管理员'
      }],
      dialogTableVisible: false,
      ruleForm2: {
        edit: '',
        account: '',
        name: '',
        comp: '',
        job: '',
        phone: '',
        email: '',
        remark: '',
        type: 0
      },
      rules2: {
        account: [
          { required: true, validator: account, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        comp: [
          { required: true, message: '请输入所在用户机构', trigger: 'blur' }
        ],
        job: [
          { required: true, message: '请输入用户职位', trigger: 'blur' }
        ],
        phone: [
          { validator: phone, trigger: 'blur' }
        ],
        email: [
          { validator: email, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialog() {
      this.dialogTableVisible = true
      this.edit = this.id
      if (this.edit) {
        queryRegister({ id: this.edit }).then(response => {
          if (response.success) {
            const $data = response.data
            this.ruleForm2 = {
              account: $data.account,
              name: $data.name,
              comp: $data.comp,
              job: $data.job,
              phone: $data.phone || '',
              email: $data.email || '',
              remark: $data.remark || '',
              type: $data.type
            }
          }
        })
      }
    }
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.edit) {
            addRegister(this.ruleForm2).then(response => {
              this.$emit('chilF')
              setTimeout(function() {
                that.pop('已成功添加')
              }, 1000)
              this.resetForm(this.ruleForm2)
              this.dialogTableVisible = false
            }).catch(error => {
              console.log(error)
            })
          } else {
            const par = this.ruleForm2
            par.id = this.edit
            updateRegister(par).then(response => {
              if (response.success) {
                setTimeout(function() {
                  that.pop('已成功更新')
                }, 1000)
                this.resetForm('ruleForm2')
                this.$emit('chilF')
                this.dialogTableVisible = false
                this.edit = ''
                this.ruleForm2 = {
                  account: '',
                  name: '',
                  comp: '',
                  job: '',
                  phone: '',
                  email: '',
                  remark: '',
                  type: 0
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
      this.$emit('chilF', true)
    },
    closed() {
      this.$refs['ruleForm2'].resetFields()
      this.edit = ''
      this.$emit('chilF', true)
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
        account: row.account,
        name: row.name,
        comp: row.comp,
        job: row.job,
        phone: row.phone,
        email: row.email,
        remark: row.remark,
        type: row.type
      }
      this.edit = row.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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