<template>
  <div class="login-container">
    <div class="logo-wrapper"></div>
    <div class="form-wrapper">
      <div class="form-contain">
        <p class="form-title">找回密码</p>
        <div class="step-wrapper">
          <el-steps :active="stepVal" finish-status="success" align-center>
            <el-step title="输入手机号"></el-step>
            <el-step title="重置密码"></el-step>
          </el-steps>
        </div>

        <div class="step-contain">
          <el-form v-show="stepFisrt" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="phoneNum">
              <el-input v-model="ruleForm.phoneNum" placeholder="请输入您的手机号码"></el-input>
            </el-form-item>
            <el-form-item prop="msgVC">
              <el-input v-model="ruleForm.msgVC" placeholder="请输入短信验证码" class="code-btn" style="width:100%">
                <el-button slot="append" :disabled="phoneCodeBol" @click="clickMsgVcLogin">
                  <span v-if="sendMsgDisabled">{{seconds + '秒后获取'}}</span>
                  <span v-if="!sendMsgDisabled">获取验证码</span>
                </el-button>
             </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="isDisabl" @click="nextStep('ruleForm')">下一步</el-button>
            </el-form-item>
            <el-form-item class="el-form-find">
              <el-button type="text" @click="goLogin">又想起来了</el-button>
            </el-form-item>
          </el-form>
          <el-form v-show="stepThird" :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
            <el-form-item prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" placeholder="请设置您的新密码" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入密码确认" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="isDisabl" @click="resetPwd('ruleForm2')">重置密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { isReg, getMsgPhone } from '@/api/login'
  import '@/styles/loginform.scss'

  export default {
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
        phoneCodeBol: false,
        sendMsgDisabled: false,
        seconds: 60,
        platId: '',
        resetStepNum: '',
        resetCode: '',
        stepVal: 0,
        stepFisrt: true,
        stepThird: false,
        isDisabl: false,
        ruleForm: {
          phoneNum: '',
          msgVC: ''
        },
        rules: {
          phoneNum: [
            { required: true, validator: validPhone, trigger: 'blur' }
          ],
          msgVC: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' }
          ]
        },
        ruleForm2: {
          pass: '',
          checkPass: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      // this.platId = Cookies.get('platId')
      // this.resetStepNum = util.urlParse('step')
      // this.resetCode = util.urlParse('sc')
      if (this.resetStepNum === '2') {
        this.stepFisrt = false
        this.stepThird = true
        this.stepVal = 2
      }
    },
    methods: {
      nextStep(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$axios.post(httpUrl.hQuery.sign.reqResetPw, {
            //   id: this.platId,
            //   mail: this.ruleForm.mail,
            //   url: httpUrl.platUrl + '/#/findPwd?step=2&sc'
            // }).then(res => {
            //   console.log(res)
            //   if (res.success) {
            //     this.stepFisrt = false
            //     this.stepVal = 1
            //   } else {
            //     let errorCode = [{
            //       code: -600001,
            //       msg: '用户不存在'
            //     }, {
            //       code: -600002,
            //       msg: '发送邮箱错误'
            //     }]
            //     for (let i = 0 i < errorCode.length i++) {
            //       if (res.code === errorCode[i].code) {
            //         this.$message.error(errorCode[i].msg)
            //         return
            //       }
            //     }
            //   }
            // })
          } else {
            return false
          }
        })
      },
      userRegisterOk() {
        isReg(this.ruleForm.phoneNum).then(res => {
          if (res.success) {
            if (res.data === true) {
              this.$message({
                message: '该账号不存在，请检查后重试',
                type: 'warning'
              })
            }
          }
        })
      },
      getPhoneLogin() {
        getMsgPhone(this.ruleForm.phoneNum, true).then((res) => {
          if (res.success) {
            this.phoneResBackLogin = res.data
          }
        })
      },
      clickMsgVcLogin() {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (!this.ruleForm.phoneNum) {
          this.$message({
            message: '请输入你的手机号码',
            type: 'warning'
          })
        } else if (!reg.test(this.ruleForm.phoneNum)) {
          this.$message({
            message: '请输入正确的手机号码',
            type: 'warning'
          })
        } else {
          this.userRegisterOk()
          const me = this
          me.sendMsgDisabled = true
          me.phoneCodeBol = true
          const interval = window.setInterval(function() {
            if ((me.seconds--) <= 0) {
              me.seconds = 60
              me.sendMsgDisabled = false
              me.phoneCodeBol = false
              window.clearInterval(interval)
            }
          }, 1000)
        }
      },
      resetPwd(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$axios.post(httpUrl.hQuery.sign.resetpw, {
            //   code: this.resetCode,
            //   pw: this.ruleForm2.pass
            // }).then(res => {
            //   console.log(res)
            //   if (res.success) {
            //     this.$alert('您可以使用新密码登录您的账户了', '恭喜您，您的密码重置成功！', {
            //       confirmButtonText: '重新登录',
            //       type: 'success',
            //       center: true,
            //       callback: action => {
            //         if (action === 'confirm') {
            //           this.$router.push({path: '/loginPlat'})
            //         }
            //       }
            //     })
            //   } else {
            //     if (res.code === -600001) {
            //       this.$alert('小提示：邮件内的链接有效时长为10分钟', '很抱歉，当前的链接已失效。', {
            //         confirmButtonText: '重新找回密码',
            //         type: 'warning',
            //         center: true,
            //         callback: action => {
            //           if (action === 'confirm') {
            //             this.stepFisrt = true
            //             this.stepThird = false
            //             this.stepVal = 0
            //           }
            //         }
            //       })
            //       return
            //     }
            //   }
            // })
          } else {
            return false
          }
        })
      },
      goLogin() {
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>
