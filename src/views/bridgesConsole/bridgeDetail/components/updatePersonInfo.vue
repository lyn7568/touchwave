<template>
  <el-dialog title="修改个人信息" :visible.sync="dialogTableVisible" width="680px">
    <el-form class="demo-ruleForm" label-width="80px" :model="ruleForm" ref="ruleForm" :rules="formRules">
      <el-row :gutter='20'>
        <el-col :span="12">
          <el-form-item label="账 号">{{account}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名">{{name}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职 位" prop="job">
            <el-input v-model="ruleForm.job" placeholder="请填写职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在机构" prop="comp">
            <el-input v-model="ruleForm.comp" placeholder="请填写所在机构"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请填写联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请填写联系邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click.native.prevent="submitForm('ruleForm')">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { MessageBox } from 'element-ui'
import { getMyself, updateMyself } from '@/api/login'
import store from '@/store'

export default {
  data() {
    var validPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      dialogTableVisible: false,
      account: store.getters.account,
      userid: store.getters.userid,
      name: store.getters.name,
      type: '',
      ruleForm: {
        job: '',
        comp: '',
        phone: '',
        email: ''
      },
      formRules: {
        comp: [
          { required: true, message: '所在机构不能为空', trigger: 'blur' }
        ],
        phone: [
          { trigger: 'blur', validator: validPhone }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getUserSelf() {
      const id = this.userid
      getMyself({ id }).then((res) => {
        if (res.success) {
          this.ruleForm.job = res.data.job
          this.ruleForm.comp = res.data.comp
          this.ruleForm.phone = res.data.phone
          this.ruleForm.email = res.data.email
          this.type = res.data.type
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const paramsData = {
            id: this.userid,
            account: this.account,
            name: this.name,
            job: this.ruleForm.job,
            comp: this.ruleForm.comp,
            phone: this.ruleForm.phone,
            email: this.ruleForm.email,
            type: this.type
          }
          updateMyself(paramsData).then((res) => {
            if (res.success) {
              MessageBox.alert('您的信息修改成功！', '提示', {
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
        }
      })
    }
  }
}
</script>
