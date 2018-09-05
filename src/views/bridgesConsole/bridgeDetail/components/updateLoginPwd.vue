<template>
  <el-dialog title="修改登录密码" :visible.sync="dialogTableVisible" width="460px">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
      <el-form-item prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" placeholder="请设置您的新密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入密码确认" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item class="el-btn-col">
        <div class="el-btn-col-box">
          <el-button type="primary" @click.native.prevent="resetPwd('ruleForm2')">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { changePw } from '@/api/login'
import { MessageBox } from 'element-ui'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请设置您的新密码'))
      } else if (value.length < 6 || value.length > 24) {
        callback(new Error('密码由6-24个字符组成，区分大小写'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码确认'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致，请重新输入!'))
      } else {
        callback()
      }
    }
    return {
      dialogTableVisible: false,
      ruleForm2: {
        pass: '',
        checkPass: ''
      },
      rules2: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newPw = this.ruleForm2.checkPass
          changePw({ newPw }).then((res) => {
            if (res.success) {
              MessageBox.alert('密码修改成功！', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                center: true,
                callback: action => {
                  if (action === 'confirm') {
                    this.dialogTableVisible = false
                    this.$refs[formName].resetFields()
                  }
                }
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
