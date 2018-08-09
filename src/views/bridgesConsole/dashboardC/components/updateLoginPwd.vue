<template>
  <el-dialog title="修改登录密码" ref="ruleForm" :visible.sync="dialogTableVisible" width="460px">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
      <el-form-item prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" placeholder="请设置您的新密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请再次输入密码确认" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item class="el-btn-col">
        <div class="el-btn-col-box">
          <el-button type="primary" @click="resetPwd('ruleForm2')">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

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
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$axios.post(httpUrl.hQuery.sign.resetpw, {
          //   code: this.resetCode,
          //   pw: this.ruleForm2.pass
          // }).then(res => {
          //   console.log(res);
          //   if (res.success) {
          //     this.$alert('您可以使用新密码登录您的账户了', '恭喜您，您的密码重置成功！', {
          //       confirmButtonText: '重新登录',
          //       type: 'success',
          //       center: true,
          //       callback: action => {
          //         if (action === 'confirm') {
          //           this.$router.push({path: '/loginPlat'});
          //         };
          //       }
          //     });
          //   } else {
          //     if (res.code === -600001) {
          //       this.$alert('小提示：邮件内的链接有效时长为10分钟', '很抱歉，当前的链接已失效。', {
          //         confirmButtonText: '重新找回密码',
          //         type: 'warning',
          //         center: true,
          //         callback: action => {
          //           if (action === 'confirm') {
          //             this.stepFisrt = true;
          //             this.stepSecond = false;
          //             this.stepThird = false;
          //             this.stepVal = 0;
          //           };
          //         }
          //       });
          //       return;
          //     };
          //   };
          // });
        } else {
          return false
        }
      })
    }
  }
}
</script>
