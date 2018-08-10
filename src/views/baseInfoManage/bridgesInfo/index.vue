<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="桥梁名称" v-model="listQuery.title">
      </el-input>
       <el-input style="width: 200px;" class="filter-item" placeholder="桥梁编号" v-model="listQuery.importance">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">查找</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加桥梁</el-button>
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
    <el-dialog title="桥梁信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main" label-width="120px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="18" :lg="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="桥梁编号">
                <el-input placeholder="请输入桥梁编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁简称">
                <el-input placeholder="请输入桥梁简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁全称">
                <el-input placeholder="请输入桥梁全称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁位置信息">
                <city></city>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地理位置信息">
                <el-input placeholder="请输入地理位置信息"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁开通日期">
                <el-date-picker
                  v-model="value2"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="维护机构">
                <el-input placeholder="请输入维护机构"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电话">
                <el-input placeholder="请输入维护单位电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电邮">
                <el-input placeholder="请输入维护单位电邮"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="6" :lg="8">
          <div style="width:100%;display: flex;justify-content:center">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </div>
          <p style="width:100%;text-align:center;font-size:20px;color:#999;">上传桥梁图片<br>
              JPEG/JPG/PNG格式大小5M以内</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细描述" class="el-to-block"><br />
            <el-input type="textarea" maxlength=500  rows=6></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" class="el-to-block"><br />
            <el-input type="textarea" maxlength=100 rows=3></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="dialogTableVisible=false">确认</el-button>
            <el-button type="primary" @click="dialogTableVisible=false">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
    <div class="pagination-container" style="text-align:center;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
//  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves'
import city from '../../city/linkage'
//  import { parseTime } from '@/utils'

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      value2: '',
      imageUrl: '',
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
    this.getList()
  },
  components: {
    city
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
      this.dialogTableVisible = true
    },
    handleUpdate(row) {
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar-uploader{
    border: 1px dashed #409EFF;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 300px;
    display: block;
  }
</style>