<template>
  <div class="dashboard-editor-container">
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col" v-for="item in dataList" :key="item.index" @click.native="goToDashboardC(item.id)">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper">
            <div class="card-image" :style="{ backgroundImage: 'url(/data/bridge'+ item.img +')'}"></div>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">桥梁名称 <span>{{item.shortName}}</span></div>
            <div class="card-panel-text">未读报警 10条</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="9"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getBridgeList } from '@/api/table'

export default {
  data() {
    return {
      listParameters: {},
      total: 0,
      dataList: [],
      ifDefault: false
    }
  },
  created() {
    this.listParameters = {
      active: 1,
      pageSize: 10,
      pageNo: 1
    }
    this.getBridgeLists()
  },
  components: {
  },
  methods: {
    getBridgeLists() {
      const param = this.listParameters
      getBridgeList(param).then(res => {
        if (res.success) {
          if (res.data.data.length === 0) {
            this.ifDefault = true
          } else {
            this.ifDefault = false
          }
          this.dataList = res.data.data
          // this.disposeData(res.data.data);
          this.total = res.data.total
        }
      })
    },
    goToDashboardC(id) {
      this.$router.push({
        path: '/bridgesConsole',
        query: { bridgeId: id }
      })
    },
    handleCurrentChange(val) {
      this.expertParameters.pageNo = val
      this.getBridgeLists()
    }
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
