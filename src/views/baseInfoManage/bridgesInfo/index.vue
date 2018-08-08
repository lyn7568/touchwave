<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 350px;margin-right:40px" class="filter-item" placeholder="桥梁名称" v-model="listQuery.title">
      </el-input>
       <el-input style="width: 350px;" class="filter-item" placeholder="桥梁编号" v-model="listQuery.importance">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary">查找</el-button>
      <el-button class="filter-item" style="margin-left: 200px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加桥梁</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="150px" align="center" label="桥梁编号">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="桥梁简称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="桥梁位置">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="维护机构">
        <template slot-scope="scope">
          <span>{{scope.row.org}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="备注信息">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
//  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves'
//  import { parseTime } from '@/utils'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      dataList: { total: 20, data: [{ num: 1111, name: '北京科技大学', address: '北京', org: '机电学院', message: '想落户上海，你还差几分？抢人才看出身，清华北大照单全收' }] },
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  filters: {
    typeFilter(type) {

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = this.dataList.data
      this.total = this.dataList.total
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
      /*  fetchList(this.listQuery).then(response => {
        this.list = this.dataList.data
        this.total =  this.dataList.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })  */
    },
    handleFilter() {
      this.listQuery.page = 1
      //  this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      //  this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      //  this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('已成功删除该传感器', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false,
        center: true
      }).then(() => {

      }).catch(() => {

      })
      /*  this.$confirm('确实要删除:桥梁12324吗？, 是否继续?', '提示', {
      confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {

        }); */
    },
    resetTemp() {

    },
    handleCreate() {

    },
    handleUpdate(row) {
    }
  }
}
</script>
