<template>
  <div class="dashboard-editor-container">
    <BInfoDialog01 ref="BInfoDialog01"></BInfoDialog01>
    <BInfoDialog02 ref="BInfoDialog02"></BInfoDialog02>
    <BInfoDialog03 ref="BInfoDialog03"></BInfoDialog03>
    <BInfoDialog04 ref="BInfoDialog04"></BInfoDialog04>

    <updatePersonInfo ref="updatePersonInfo"></updatePersonInfo>
    <updateLoginPwd ref="updateLoginPwd"></updateLoginPwd>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="15" :lg="18">
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>报警信息</span>
            <el-button type="text">查看全部</el-button>
          </div>
          <ul class="item-ul">
            <li v-for="item in [0,1,2,3,4]" :key="item.id">2018年8月1日11:42      XXXXX大桥XXX采集盒XXX传感器检测到异常情况，请点击查看。    未读标记</li>
          </ul>
        </el-card>
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>实时监测</span>
          </div>
          <el-row>
            <line-chart :chart-data="lineChartData"></line-chart>
          </el-row>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="9" :lg="6">
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>基础信息查看</span>
          </div>
          <el-row :gutter="10" class="item-row">
            <el-col :span="12"><div class="grid-content" @click="queryBirdgeInfo">桥梁信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="queryServerInfo">采集服务器信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="queryBoxInfo">采集盒信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="querySensorInfo">传感器信息</div></el-col>
          </el-row>
        </el-card>
        <el-card class="box-card block-group">
          <div slot="header" class="block-title">
            <span>常用操作</span>
          </div>
          <el-row :gutter="10" class="item-row">
            <el-col :span="12"><div class="grid-content">历史报警信息查询</div></el-col>
            <el-col :span="12"><div class="grid-content">历史监测信息查询</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="updatePersonInfo">修改个人信息</div></el-col>
            <el-col :span="12"><div class="grid-content" @click="updateLoginPwd">修改登录密码</div></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import LineChart from './components/LineChart'
import BInfoDialog01 from './components/BInfoDialog01'
import BInfoDialog02 from './components/BInfoDialog02'
import BInfoDialog03 from './components/BInfoDialog03'
import BInfoDialog04 from './components/BInfoDialog04'

import updatePersonInfo from './components/updatePersonInfo'
import updateLoginPwd from './components/updateLoginPwd'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard-other',
  components: {
    LineChart,
    BInfoDialog01,
    BInfoDialog02,
    BInfoDialog03,
    BInfoDialog04,
    updatePersonInfo,
    updateLoginPwd
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    queryBirdgeInfo() {
      this.$refs.BInfoDialog01.dialogTableVisible = true
    },
    queryServerInfo() {
      this.$refs.BInfoDialog02.dialogTableVisible = true
    },
    queryBoxInfo() {
      this.$refs.BInfoDialog03.dialogTableVisible = true
    },
    querySensorInfo() {
      this.$refs.BInfoDialog04.dialogTableVisible = true
    },
    updatePersonInfo() {
      this.$refs.updatePersonInfo.dialogTableVisible = true
    },
    updateLoginPwd() {
      this.$refs.updateLoginPwd.dialogTableVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .block-group{
    background: #fff;
    margin-bottom: 20px;
    .block-title{
      display: flex;
      justify-content: space-between;
      .el-button{
        padding: 3px 0;
      }
    }
    .item-ul{
      margin: 0;
      padding: 0 10px;
      li{
        padding: 8px 0;
        margin: 0;
        list-style: none;
      }
    }
    .grid-content{
      height: 100px;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
      background-color: #f8f8f8;
      margin-bottom: 8px;
      padding:20px;
      cursor: pointer;
      &:hover {
        transition: all 0.2s ease-out;
        color: #fff;
        background: #36a3f7;
      }
    }
  }
}
</style>
