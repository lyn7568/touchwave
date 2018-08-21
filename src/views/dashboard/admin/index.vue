<template>
  <div class="dashboard-editor-container">
    <img class="plat-pic" src="/static/pg.png" alt="桥梁">
    <p class="plat-tit">欢迎使用<br />声脉桥梁云监控平台</p>
  </div>
</template>


<script>
export default {
  name: 'dashboard-admin',
  created() {
    // this.toPath()
  },
  methods: {
    // toPath() {
    //   this.$router.push({ name: 'infoManage' })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  .plat-pic{
    margin: 40px auto 10px;
  }
  .plat-tit{
    font-size: 34px;
    line-height: 60px;
    letter-spacing: 4px;
  }
}
</style>
