<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <TopNavbar></TopNavbar>
    <sidebar class="sidebar-container" v-if="roles.indexOf('1')>=0"></sidebar>
    <div class="main-container" :style="(roles.indexOf('1')>=0) ? '' : 'marginLeft:0'">
      <navbar></navbar>
      <app-main></app-main>
    </div>
    <div class="main-footer">
      <div style="margin:0 auto;line-height:20px;color:#939393; padding:12px 0;overflow: hidden;width:380px">
        <a style="margin: 0 5px 0 0;float:left">京ICP备16026450号-2 |</a>
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802027571" style="display:inline-block;text-decoration:none;float:left">
          <img src="./img/beian.png" width="18" style="float:left;"/>
          <p style="float:left;margin: 0 0 0 5px;">京公网安备 11010802027571号</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { TopNavbar, Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    TopNavbar,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'roles'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .main-footer{
    z-index: 2002;
    position:fixed;
    background: rgba(48, 65, 86, 1);
    border-top:1px solid #e6e6e6;
    bottom:0;
    left:0;
    right:0;
    font-size:14px;
    text-align: center;
    color: #333;
  }
</style>
