<template>
   <el-form class="form-main" label-width="120px">
      <el-row>
         <el-col :span="24" >
            <el-input type="textarea" rows=8 maxlength=100></el-input>
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
