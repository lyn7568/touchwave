<template>
  <el-menu class="topnavbar" mode="horizontal">
    <div class="logo-container">
      <img class="logo-wrapper" src="/static/touchwave.png" alt="">
      <el-dropdown v-if="roles.indexOf('1')<0" trigger="click" style="cursor: pointer;margin-left:20px">
        <span class="el-dropdown-link">
          {{showName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu style="min-width:120px;" slot="dropdown">
          <el-dropdown-item v-for="item in dataList" :key="item.index"@click.native="goToDashboardC(item.id, item.shortName)">{{item.shortName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
      	<div>您好，{{ name }}</div>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>主页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBridgeList } from '@/api/bridgeInfo'
import { urlParse } from '@/utils'

export default {
  data() {
    return {
      bridgeId: '',
      showName: '选择大桥',
      dataList: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.bridgeId = urlParse('id')
    this.getBridgeLists()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getBridgeLists() {
      const param = {
        active: 1,
        pageSize: 10,
        pageNo: 1
      }
      getBridgeList(param).then(res => {
        if (res.success) {
          this.dataList = res.data.data
        }
      })
    },
    goToDashboardC(id, name) {
      this.$router.push({
        path: '/bridgeDetail',
        query: { id: id, name: name }
      })
      this.showName = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.topnavbar {
  position: fixed;
  font-size: 0px;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  z-index:1002;
  border-radius: 0px !important;
  .logo-container {
    display: inline-block;
    position: absolute;
    left:10px;
    .logo-wrapper {
      width:260px;
      margin:14px 20px;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

