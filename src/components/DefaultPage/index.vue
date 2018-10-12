<template>
  <div class="ev_content" v-show="show">
    <div class="notice_d" v-show="noResult">
      <div class="d_prompt">
        <p class="d_2">{{message2}}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    noResult: {
      type: Boolean,
      default: true
    },
    message2: {
      type: String,
      default: '没有相关数据'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ev_content{
    width: 100%;
    height: 42%;
    z-index: 11;
    padding: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content:center;
  }

  .d_prompt p{
    margin: 0;
    font-size: 0;
  }

  .d_prompt .d_2{
    height: auto;
    margin: 0 auto;
    word-break: break-word;
    font-size: 13px;
    color: #999999;
    text-align: center;
    margin-top: 10px;
  }

</style>
