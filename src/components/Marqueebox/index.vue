<template>
  <div>
    <el-dialog title="系统消息编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formNotice" ref="formNotice" :rules="rules">
        <el-input type="textarea" v-model="formNotice.desc"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setNotice('formNotice')">确 定</el-button>
      </div>
    </el-dialog>
    <el-menu class="message-box" mode="horizontal">
      <div class="marquee_box">
        <span class="tit">系统公告：</span>
        <div ref="rollul" class="marquee_text" :class="{anim:animate}">
          {{formNotice.desc}}
        </div>
        <span class="btn-span" v-if="isShow" @click="openNoticeDialog">设置</span>
      </div>
    </el-menu>
  </div>
</template>
 
<script>
import { getNotice, updateNotice } from '@/api/login'
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      animate: true,
      formNotice: {
        desc: ''
      },
      rules: {
        desc: [
          { required: true, message: '请编辑内容发送', trigger: 'blur' },
          { max: 100, message: '不得超过100个字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getNotice()
    setInterval(this.scroll, 3000)
  },
  methods: {
    getNotice() {
      getNotice().then(res => {
        if (res.success) {
          this.formNotice.desc = res.data
        }
      })
    },
    openNoticeDialog() {
      this.dialogFormVisible = true
    },
    setNotice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {
            cnt: this.formNotice.desc
          }
          updateNotice(param).then(res => {
            if (res.success) {
              this.dialogFormVisible = false
              this.$refs[formName].resetFields()
            }
          })
        } else {
          return false
        }
      })
    },
    scroll() {
      // const con1 = this.$refs.rollul
      // con1.style.marginTop = '0px'
      // this.animate = !this.animate
      // var that = this
      // setTimeout(() => {
      //   con1.style.marginTop = '-50px'
      //   that.animate = !that.animate
      // }, 1000)
    }
  }
}
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
.message-box{
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  border-radius: 0px !important;
  color: #303133;
  background: #c7e3ff;
  padding: 0 20px;
  font-size: 14px;
  .marquee_box {
    width: 100%;
    position: relative;
    height: 50px;
    overflow: hidden;
    .marquee_text {
      line-height: 50px;
      position:absolute;
      top:0;
      padding-left:68px;
      padding-right: 80px;
      width:100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .btn-span{
      position:absolute;
      top:0;
      right:0;
      cursor: pointer;
    }
  }
  .anim{
    transition: all 0.5s;
  }
}
.el-textarea .el-textarea__inner{
  height: 160px;
}
</style>
