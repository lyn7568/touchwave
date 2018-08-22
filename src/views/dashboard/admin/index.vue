<template>
  <div class="dashboard-editor-container">
    <div>
      <img class="plat-pic" src="/static/touchwave.png" width="460">
      <p class="plat-tit">欢迎 <span>{{name}}</span> 使用声脉桥梁云监控平台</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard-admin',
  computed: {
    ...mapGetters([
      'name'
    ])
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
  margin: 20px;
  height: 100%;
  padding: 15% 0;
  background: #fff;
  .plat-pic{
    margin: 40px auto 0;
  }
  .plat-tit{
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 2px;
    span{
      color: #0f76c4;
    }
  }
}
</style>
