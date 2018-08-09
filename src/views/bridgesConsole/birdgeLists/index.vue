<template>
  <div class="dashboard-editor-container">
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col" v-for="item in [0,1,2,3,4]" :key="item.id" @click.native="goToDashboardC">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper">
            <div class="card-image" style="background-image: url(/static/touchwave.png);"></div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">桥梁名称 <span>山东青岛跨海大桥A段</span></div>
            <div class="card-panel-text">未读报警 10条</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination background current-page="1" :page-sizes="[10,20,30, 50]" page-size="20" layout="total, sizes, prev, pager, next, jumper" total="60">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  methods: {
    goToDashboardC() {
      this.$router.push({ path: 'dashboardC' })
    }
    // @size-change="handleSizeChange" @current-change="handleCurrentChange"
    // handleSizeChange(val) {
    //   this.listQuery.limit = val
    //   this.getList()
    // },
    // handleCurrentChange(val) {
    //   this.listQuery.page = val
    //   this.getList()
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container{
  padding: 32px;
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      cursor: pointer;
      padding: 15px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
      }
      .card-panel-icon-wrapper {
        margin: 10px 0;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-image{
        width: 100%;
        max-width: 280px;
        margin: auto;
        height: 160px;
        border: 1px solid #d0d0d0;
        background-position: center;
        background-size: cover;
      }
      .card-panel-icon {
        font-size: 48px;
      }
      .card-panel-description {
        font-weight: bold;
        margin-top:12px;
        .card-panel-text {
          line-height: 24px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
