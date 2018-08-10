<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="账号" v-model="listQuery.title">
      </el-input>
       <el-input style="width: 200px;" class="filter-item" placeholder="用户姓名" v-model="listQuery.importance">
      </el-input>
       <el-input style="width: 250px;" class="filter-item" placeholder="所在机构" v-model="listQuery.importance">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加传感器</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
      style="width: 100%;min-height:550px;">
      <el-table-column width="110px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="50px" align="center" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{scope.row.org}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="用户类型">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="账户状态">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="所在机构">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="负责桥梁">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="260px" class-name="small-padding fixed-width">
        <template slot-scope="scope"> 
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button> 
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">停用
          </el-button>
           <el-button size="mini" type="primary" @click="handleModifyStatus(scope.row,'deleted')">分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-dialog title="编辑用户" ref="ruleForm" :visible.sync="dialogTableVisible" width="680px">
     <editUser></editUser>
     <editSystemMessage></editSystemMessage>
  </el-dialog>
  <editUserPermissions></editUserPermissions>
    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
//  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves'
import editUser from './editUser'
import editSystemMessage from './editSystemMessage'
import editUserPermissions from './editUserPermissions'
//  import { parseTime } from '@/utils'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      options: [{
        value: '上游主缆',
        label: '上游主缆'
      }, {
        value: '下游主缆',
        label: '下游主缆'
      }],
      value: '',
      options1: [{
        value: '东跨',
        label: '东跨'
      }, {
        value: '西跨',
        label: '西跨'
      }, {
        value: '南跨',
        label: '南跨'
      }, {
        value: '中跨',
        label: '中跨'
      }, {
        value: '北跨',
        label: '北跨'
      }],
      value1: '',
      restaurants: [],
      state4: '',
      timeout: null,
      dialogTableVisible: false,
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
    this.restaurants = this.loadAll()
    this.getList()
  },
  components: {
    editUser,
    editSystemMessage,
    editUserPermissions
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   let paramsData = {
        //     'title': this.ruleFormDem.demandTit,
        //     'descp': this.ruleFormDem.demandDesc,
        //     'province': this.ruleFormDem.province,
        //     'city': this.ruleFormDem.city,
        //     'invalidDay': util.dateFormatter(this.ruleFormDem.lastDate, false, true),
        //     'cost': this.selectCostRange,
        //     'duration': this.selectLongTime,
        //     'orgName': this.ruleFormDem.orgName,
        //     'contactNum': this.ruleFormDem.linkTel,
        //     'creator': this.kxUserId,
        //     'source': this.platSource
        //   };
        //   this.$axios.post(httpUrl.kxQurey.demand.add, paramsData).then((res) => {
        //     if (res.success) {
        //       this.$alert('我们已收到您的需求，马上为您对接合适的专家和专业机构，您可以登录科袖网与对方做进一步沟通。', '需求发布成功！', {
        //         confirmButtonText: '进入科袖网，发现更多服务和资源',
        //         type: 'success',
        //         center: true,
        //         cancelButtonText: '取消',
        //         callback: action => {
        //           if (action === 'confirm') {
        //             window.open(util.ekexiuUrl, '科袖网首页');
        //           };
        //         }
        //       });
        //       this.resetForm(formName);
        //       this.$emit('dialogChangedLogin', false);
        //     } else {
        //       this.$message({
        //         message: '需求发布失败，请重新发布！',
        //         type: 'warning'
        //       });
        //     };
        //     console.log(res);
        //   });
        // } else {
        //   console.log('error submit!!');
        //   return false
        }
      })
    },
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
      this.dialogTableVisible = true
    },
    handleUpdate(row) {
    },
    loadAll() {
      return [{ 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' }]
    },
    querySearchAsync(queryString, cb) {
      console.log(queryString + 'wewe')
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      console.log(results + 'dddd')
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item + 'ccc')
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
</style>