<template>
  <div class="topnavbar">
    <div class="logo-container">
      <div class="logo-wrapper" @click="toHome"><div class="logo-img"></div></div>
      <el-dropdown v-if="roles.indexOf('1')<0 && dataList.length>0" trigger="click" class="drop-menu">
        <span class="el-dropdown-link">
          {{showName ? showName : '选择桥梁'}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu class="drop-menu-list" style="min-width:120px;" slot="dropdown">
          <el-dropdown-item v-for="item in dataList" :key="item.index" :disabled="item.disab" @click.native="goToDashboardC(item.id, item.shortName)">{{item.shortName}}
            <i v-if="item.disab" class="el-icon-check"></i>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="name-box">
      <span>您好，{{ name }}</span>
      <span class="exit-btn" @click="logout">退出登录</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { MessageBox } from 'element-ui'
import { getBridgeList } from '@/api/bridgeInfo'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      bridgeId: '',
      showName: '',
      dataList: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  watch: {
    '$route'(to, from) {
      if (to.path === '/dashboard') {
        var dataList = this.dataList
        for (let i = 0; i < dataList.length; i++) {
          dataList[i].disab = false
        }
        Cookies.remove('bridgeId')
        Cookies.remove('bridgeName')
        this.showName = ''
      } else {
        this.bridgeId = Cookies.get('bridgeId')
        this.showName = Cookies.get('bridgeName')
        this.getBridgeLists()
      }
    }
  },
  created() {
    this.bridgeId = Cookies.get('bridgeId')
    this.showName = Cookies.get('bridgeName')
    this.getBridgeLists()
  },
  methods: {
    toHome() {
      this.$router.replace({ path: '/' })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      MessageBox.confirm('您确认要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          Cookies.remove('bridgeId')
          Cookies.remove('bridgeName')
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
        console.log('已取消退出')
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
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].id === this.bridgeId) {
              res.data.data[i].disab = true
            } else {
              res.data.data[i].disab = false
            }
          }
          this.dataList = res.data.data
        }
      })
    },
    goToDashboardC(id, name) {
      this.showName = name
      Cookies.set('bridgeId', id)
      Cookies.set('bridgeName', name)
      this.$router.replace({
        name: 'bridgeDetail',
        query: { id: id, name: name }
      })
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
  z-index:2002;
  border-radius: 0px !important;
  background-color: #2d3a4b;
  border-bottom: 1px solid #e6e6e6;
  .logo-container {
    display: inline-block;
    position: absolute;
    left:10px;
    overflow: hidden;
    .logo-wrapper {
      float:left;
      width:300px;
      padding: 0;
      margin:10px 12px;
      cursor: pointer;
    }
    .drop-menu{
      float:left;
      cursor: pointer;
      margin:0;
      margin-left:20px;
      color: #fff;
    }
  }
  .name-box{
    display: inline-block;
    position: absolute;
    right: 20px;
    font-size:14px;
    overflow: hidden;
    color:#fff;
    .exit-btn {
      margin-left:30px;
      cursor: pointer;
    }
  }
}
.drop-menu-list{
  .el-dropdown-menu__item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.is-disabled{
      background: #f3f5f7;
    }
    .el-icon-check{
      font-weight: bold;
    }
  }
}
</style>

