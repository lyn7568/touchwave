<template>
  <el-dialog title="桥梁信息" :visible.sync="dialogTableVisible" width="80%">
    <el-form class="form-main">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="18" :lg="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="桥梁编号">000000001</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁简称">青岛跨海大桥A段</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁全称">山东省青岛市胶州跨海大桥A段</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="桥梁位置信息">山东省青岛市胶州</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地理位置信息">青岛跨海大桥南侧</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="桥梁开通日期">2018/07/21</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="维护单位">青岛拉升阶段拉升阶段是觉得了科技有限公司</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电话">40988923-328</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维护单位电邮">23142121@163.com</el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="6" :lg="8">
          <div style="width:100%">
            <img src="/static/touchwave.png" alt="桥梁图片" width="90%">
          </div>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%;margin:15px 0">
        <el-table-column v-for="item in tableRow" :key="item.id"
          :prop="item.prop"
          :label="item.label">
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <el-form-item label="大桥描述" class="el-to-block"><br />
            <div class="textarea-div">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" class="el-to-block"><br />
            <div class="textarea-div">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="el-btn-col">
          <div class="el-btn-col-box">
            <el-button type="primary" @click="dialogTableVisible=false">关闭</el-button>
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
      dialogTableVisible: false,
      tableRow: [{
        prop: 'date',
        label: '维护负责人'
      }, {
        prop: 'name',
        label: '职位'
      }, {
        prop: 'address',
        label: '所在机构'
      }, {
        prop: 'address2',
        label: '联系电话'
      }, {
        prop: 'address3',
        label: '联系邮箱'
      }],
      tableData: [{
        date: '王明',
        name: '工程师',
        address: '上海市普陀区金沙江路 1518 弄',
        address2: '15795223636',
        address3: '26586466@qq.com'
      }, {
        date: '王明',
        name: '工程师',
        address: '上海市普陀区金沙江路 1518 弄',
        address2: '15795223636',
        address3: '26586466@qq.com'
      }, {
        date: '王明',
        name: '工程师',
        address: '上海市普陀区金沙江路 1518 弄',
        address2: '15795223636',
        address3: '26586466@qq.com'
      }]
    }
  },
  methods: {

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
</style>