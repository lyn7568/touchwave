<template>
  <div class="dashboard-editor-container">
    超级管理员，欢迎您
  </div>
</template>


<script>
export default {
  name: 'dashboard-admin',
  created() {
    this.toPath()
  },
  methods: {
    toPath() {
      this.$router.push({ name: 'infoManage' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
