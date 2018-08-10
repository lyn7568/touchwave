<template>
  <div class="login-container">
    <div class="logo-wrapper"></div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入登录密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="imgVerifyCode">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input v-model="loginForm.imgVerifyCode" placeholder="请输入图形验证码" class="code-btn">
        <img slot="append" :src="imgVcUrl" @click="changeImgVc" /></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
      <el-form-item class="el-form-find">
        <el-button type="text" @click.native.prevent="goBackPwd">忘记密码？</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { getPictureVC } from '@/api/pictureVc'
import '@/styles/loginform.scss'

export default {
  name: 'login',
  data() {
    var validPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (!value) {
        callback(new Error('请输入你的手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      imgVerifyCode: '',
      imgVcUrl: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validPhone }],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 24, message: '密码由6-24个字符组成，区分大小写', trigger: 'blur' }
        ],
        imgVerifyCode: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  created() {
    this.changeImgVc()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goBackPwd() {
      this.$router.push({ path: '/findPwd' })
    },
    changeImgVc() {
      this.imgVcUrl = getPictureVC('PIC_LOGIN')
    }
  }
}
</script>
