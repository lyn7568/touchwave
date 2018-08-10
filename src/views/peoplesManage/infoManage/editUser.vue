<template>
   <el-form class="form-main" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号">
            <el-input placeholder="请输入账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名">
            <el-input placeholder="请输入用户姓名"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="职位">
            <el-input placeholder="请输入用户职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户类型">
            <el-select v-model="value" placeholder="请选择用户类型">
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
          <el-form-item label="联系电话">
            <el-input placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系邮箱">
            <el-input placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在机构">
            <el-input placeholder="请输入所在用户机构"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="24" >
         备注
          <div class="editTe">
            <el-input type="textarea" row=4></el-input>
          </div>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
            <el-button type="info">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '上游主缆',
        label: '上游主缆'
      }, {
        value: '下游主缆',
        label: '下游主缆'
      }],
      value: ''
    }
  }
}
</script>