<template>
  <el-dialog title="用户数据权限修改" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main">
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="list-item">
            <el-row>
              <el-col :span="12">
                <el-form-item label="账号">000000001</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户姓名">2</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户类型">000000001</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职位">2</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属机构">1926831</el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12">
          <div class="list-item">
            <el-row>
              <el-col :span="24">
                <el-form-item label="添加负责桥梁">
                  <el-autocomplete
                    v-model="state4"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请选择一个桥梁"
                    @select="handleSelect">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="24"> 
                 <el-table
                  :data="tableData3"
                  height="250"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label=""
                    min-width="180">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="">
                    <template slot-scope="scope">  
                      <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="dialogTableVisible=false">关闭</el-button>
            <el-button type="primary" @click="dialogTableVisible=false">确认</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      restaurants: [],
      state4: '',
      timeout: null,
      dialogTableVisible: false
    }
  },
  created() {
    this.restaurants = this.loadAll()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
  .el-form-item{
    margin: 0;
  }
  .textarea-div{
    line-height: 26px;
    margin-bottom: 10px;
  }
  .list-item{
    
    margin-bottom: 20px;
    padding: 10px 15px;
  }
</style>