<template>
  <div>
    <el-dialog title="系统消息编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formNotice" ref="formNotice" :rules="rules">
        <el-input type="textarea" rows="6" maxlength="100" v-model="formNotice.desc" @input="limitFn"></el-input>
      </el-form>
      <div class="limit_num">还可以输入{{ableNum}}字</div>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-waves @click="setNotice('formNotice')">确 定</el-button>
      </div>
    </el-dialog>
    <el-menu class="message-box" mode="horizontal">
      <div class="marquee_box">
        <span class="tit">系统公告：</span>
        <el-tooltip placement="bottom-end" effect="dark">
          <div slot="content" class="popper-tips">{{formNotice.desc}}</div>
          <div class="marquee_text">{{formNotice.desc}}</div>
        </el-tooltip>
        <span class="btn-span" v-if="isShow" @click="openNoticeDialog">设置</span>
      </div>
    </el-menu>
  </div>
</template>
 
<script>
import waves from '@/directive/waves'
import { getNotice, updateNotice } from '@/api/login'
export default {
  props: {
    isShow: {
      type: Boolean
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      dialogFormVisible: false,
      ableNum: 100,
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
  },
  methods: {
    limitFn() {
      this.ableNum = 100 - this.formNotice.desc.length
    },
    getNotice() {
      getNotice().then(res => {
        if (res.success) {
          this.formNotice.desc = res.data
          this.limitFn()
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
    }
  }
}
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
.message-box{
  height: 50px;
  line-height: 50px;
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
      padding-left: 0;
      left:68px;
      right:80px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      white-space:nowrap;
      overflow: hidden;
    }
    .btn-span{
      position:absolute;
      top:0;
      right:0;
      cursor: pointer;
    }
  }
}
.limit_num{
  font-size: 14px;
  color: #ff0000;
  text-align: right;
}
.popper-tips{
  font-size: 13px;
  line-height: 20px;
  display:block;
  max-width: 500px;
  word-break: break-all;
}
</style>
