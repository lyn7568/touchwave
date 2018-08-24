<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="账号" v-model="listQuery.account">
      </el-input>
       <el-input style="width: 200px;" class="filter-item" placeholder="用户姓名" v-model="listQuery.name">
      </el-input>
       <el-input style="width: 250px;" class="filter-item" placeholder="所在机构" v-model="listQuery.comp">
      </el-input>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加用户</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="110px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.job}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="用户类型">
        <template slot-scope="scope">
          <span>{{(scope.row.type) ? '管理员' : '普通用户'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="账户状态">
        <template slot-scope="scope">
          <span :class="{ active: !scope.row.active}">{{(scope.row.active) ? '未停用' : '已停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="所在机构">
        <template slot-scope="scope">
          <span>{{scope.row.comp}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="负责桥梁">
        <template slot-scope="scope">
          <span>{{scope.row.bridgeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260px" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button v-waves :type="((!scope.row.active) ? 'info' : 'primary')" size="mini" @click="handleUpdate(scope.row)" :disabled='!scope.row.active'>编辑</el-button> 
          <el-button v-waves size="mini" :type="((!scope.row.active) ? 'info' : 'danger')" @click="handleModifyStatus(scope.row,'deleted')" :disabled='!scope.row.active'>停用
          </el-button>
           <el-button v-waves size="mini" :type="((!scope.row.active) ? 'info' : 'primary')" @click="distribution(scope.row)" :disabled='!scope.row.active'>分配权限
          </el-button>
        </template>
        
      </el-table-column>
    </el-table>
    <editUser :dialog="dialogTableVisible" @chilF='chilF' :id='edit'></editUser>
    <editUserPermissions :dialog='dialogPerssion' @chilF='chilF' :id='edit'></editUserPermissions>
    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { deleteUser, queryResponsibleBridge, pageQueryUser } from '@/api/userManagemen'
import waves from '@/directive/waves'
import editUser from './editUser'
import editUserPermissions from './editUserPermissions'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      edit: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogPerssion: false,
      dialogTableVisible: false,
      listQuery: {
        account: '',
        name: '',
        comp: '',
        pageSize: 10,
        pageNo: 1
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
  components: {
    editUser,
    editUserPermissions
  },
  methods: {
    getList() {
      this.listLoading = true
      pageQueryUser(this.listQuery).then(response => {
        if (response.data === null) {
          this.list = []
          this.total = 0
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
          return
        }
        const $data = response.data.data
        for (let i = 0; i < $data.length; i++) {
          $data[i].bridgeName = ''
          queryResponsibleBridge({ uid: $data[i].id, active: 1 }).then(response => {
            if (response.success) {
              const arr = []
              const $info = response.data
              for (let j = 0; j < $info.length; j++) {
                arr.push($info[j].shortName)
              }
              this.list[i].bridgeName = arr.join(',')
              this.$forceUpdate()
            }
          })
        }
        this.list = $data
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    chilF(val) {
      if (!val) {
        this.getList()
      }
      this.edit = ''
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('确实要停用:用户' + row.name + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUser({ id: row.id }).then(response => {
          if (response.success) {
            this.getList()
            this.pop('已成功停用该用户')
          }
        })
      }).catch(() => {

      })
    },
    handleCreate() {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    handleUpdate(row) {
      this.edit = row.id
      this.dialogTableVisible = !this.dialogTableVisible
    },
    distribution(row) {
      this.edit = row.id
      this.dialogPerssion = !this.dialogPerssion
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-autocomplete{
    display: block
  }
  .el-btn-col{
    margin-top: 45px
  }
  .editTe{
    margin: 10px 0 0 22px
  }
  .active{
    color: red
  }
</style>
