<template>
  <el-dialog title="修改个人信息" ref="ruleForm" :visible.sync="dialogTableVisible" width="680px">
    <el-form class="form-main" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="账 号">13679879708</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名">李二蛋</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职 位">
            <el-input placeholder="请填写职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在机构">
            <el-input placeholder="请填写所在机构"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input placeholder="请填写联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系邮箱">
            <el-input placeholder="请填写联系邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   let paramsData = {
        //     'title': this.ruleFormDem.demandTit,
        //     'descp': this.ruleFormDem.demandDesc,
        //     'province': this.ruleFormDem.province,
        //     'city': this.ruleFormDem.city,
        //     'invalidDay': util.dateFormatter(this.ruleFormDem.lastDate, false, true),
        //     'cost': this.selectCostRange,
        //     'duration': this.selectLongTime,
        //     'orgName': this.ruleFormDem.orgName,
        //     'contactNum': this.ruleFormDem.linkTel,
        //     'creator': this.kxUserId,
        //     'source': this.platSource
        //   };
        //   this.$axios.post(httpUrl.kxQurey.demand.add, paramsData).then((res) => {
        //     if (res.success) {
        //       this.$alert('我们已收到您的需求，马上为您对接合适的专家和专业机构，您可以登录科袖网与对方做进一步沟通。', '需求发布成功！', {
        //         confirmButtonText: '进入科袖网，发现更多服务和资源',
        //         type: 'success',
        //         center: true,
        //         cancelButtonText: '取消',
        //         callback: action => {
        //           if (action === 'confirm') {
        //             window.open(util.ekexiuUrl, '科袖网首页');
        //           };
        //         }
        //       });
        //       this.resetForm(formName);
        //       this.$emit('dialogChangedLogin', false);
        //     } else {
        //       this.$message({
        //         message: '需求发布失败，请重新发布！',
        //         type: 'warning'
        //       });
        //     };
        //     console.log(res);
        //   });
        // } else {
        //   console.log('error submit!!');
        //   return false
        }
      })
    }
  }
}
</script>
