<template>
  <div>
    <router-view :bridgeName="bridgeName"></router-view>
  </div>
</template>
<script>
import '@/styles/roleuser.scss'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      bridgeName: ''
    }
  },
  created() {
    this.bridgeName = Cookies.get('bridgeName')
  }
}
</script>
