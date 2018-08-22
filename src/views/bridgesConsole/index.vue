<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <breadcrumb></breadcrumb>
    </el-menu>
    <router-view></router-view>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'bridgeHome',
  components: {
    Breadcrumb
  }
}
</script>
