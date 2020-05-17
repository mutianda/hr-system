<template>
  <el-card class="box-card" body-style="padding: 5px 10px;border:0px;height:100%;">
    <el-row>

      <el-col :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleDownload">导出当前</el-button>
      </el-col>
      <el-col :span="2">
        <!--        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">-->
        <!--          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />-->
        <!--        </el-table>-->
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleUpLoad">导入通讯录</el-button>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addUser">添加员工</el-button>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary" icon="el-icon-search" @click="subSearchForm('searchForm')" @keyup.enter="subSearchForm">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="user_name"
        label="员工名称"
        min-width="180"
        align="center"
      />
      <el-table-column
        prop="user_phone"
        label="手机号码"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="user_email"
        label="邮箱"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="salary"
        label="薪水"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="role"
        label="角色"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.role<2?'success':'warning'">{{ scope.row.role<2?'经理':'员工' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_email"
        label="邮箱"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="workStatus"
        label="是否在职"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.workStatus==1?'success':'info'">{{ scope.row.workStatus==0?'离职':'在职' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="workStatus"
        label="操作"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="warning" plain @click="updataUser(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block page-block">
      <el-pagination
        :current-page="searchForm.currentPage"
        :page-sizes="searchForm.pageSizes"
        :page-size="searchForm.pageSize"
        :total="searchForm.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="选择导入文件"
      :visible.sync="excelDialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-table :data="phoneList" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for="item of phoneHeader" :key="item" :prop="item" :label="item" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toUpdatePhone">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加编辑员工"
      :visible.sync="addUserDialog"
      width="520px"
      :before-close="handleDialogClose"
    >
      <el-form :model="userForm" class="demo-form-inline" :rules="userRule" ref="form" label-width="80px">

        <el-form-item label="姓名" prop="username">
          <el-input v-model="userForm.username" placeholder="姓名" style="width: 300px" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="手机号" style="width: 300px" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"  placeholder="邮箱" style="width: 300px" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio v-model="userForm.role" :label="1">经理</el-radio>
          <el-radio v-model="userForm.role" :label="2">员工</el-radio>

        </el-form-item>
        <el-form-item label="薪水" prop="salary">
          <el-input v-model="userForm.salary"  placeholder="薪水" style="width: 300px" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="密码" style="width: 300px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="handleUser">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
import { workerList, updatePhone,addUser } from '../../api/admin'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import {updateUser} from '@/api/myself'

export default {
  name: 'SalaryList',
  components: { UploadExcelComponent },
  data() {
    return {
      searchForm: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      },
      excelDialogVisible: false,
      tableData: [],
      phoneHeader: [],
      addOrEdit:false,
      phoneList: [],
      addUserDialog:false,
      userForm:{
        username:'',
        phone:'' ,password:'',email:'',role:'',salary:''
      },
      userRule:{
        username: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
        phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },

      ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },

        ],
        role: [
          { required: true, message: '请输入角色', trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请输入薪水', trigger: 'blur' },

        ]
    },
      filename: '员工统计表'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  mounted() {
    this.getWorkerList()
  },
  methods: {
    handleUpLoad() {
      this.excelDialogVisible = true
    },
    addUser() {
      this.addUserDialog = true
      this.addOrEdit = true
      this.userForm={
        username:'',
          phone:'' ,password:'',email:'',role:'',salary:''
      }
    },
    updataUser(use) {
      const user = Object.assign(use,{})
      this.addOrEdit = false

      this.userForm={
        userId: user.id,
        username: user.user_name,
        phone: user.user_phone,
        password:user.user_password,
        email: user.user_email,
        role: user.role,
        salary: user.salary
      }
      this.addUserDialog = true

    },
    toupdateUser(){
      updateUser(this.userForm).then(res=>{
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getWorkerList()

        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }

        this.handleDialogClose()
      })
    },
    handleDialogClose(){
      this.addUserDialog = false
      this.userFrom={
        username:'',
        phone:'' ,password:'',email:'',role:'',salary:''
      }
    },
    handleUser(){
      if(this.addOrEdit){
        this.toAddUser()
      }else {
        this.toupdateUser()
      }

    },
    toAddUser() {
      addUser(this.userForm).then(res => {
        this.handleDialogClose()
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getWorkerList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    handleClose() {
      this.excelDialogVisible = false
    },
    toUpdatePhone() {
      this.phoneList = [{ username: '张经理', phone: '1998723131' }, { username: '张员工', phone: '0000212' }]
      updatePhone(this.phoneList).then(res => {
        if (res.code) {
          this.$message({
            type: 'success',
            message:'更新成功'
          })
          this.getWorkerList()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.phoneList = results
      this.phoneHeader = header
      console.log(results)
    },
    getWorkerList() {
      const data = {
        userId: this.user.id,
        ...this.searchForm
      }
      workerList(data).then(res => {
        console.log(res)
        if (res.data) {
          this.tableData = res.data.dataList
          this.searchForm.pageSize = res.data.pageSize - 0
          this.searchForm.currentPage = res.data.currentPage - 0
          this.searchForm.total = res.data.total - 0
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getWorkerList()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getWorkerList()
    },
    // 带条件查询
    subSearchForm() {
      this.searchForm.total = 0

      this.searchForm.currentPage = 1
      this.getWorkerList()
    },
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['date', 'name', 'address']
          const filterVal = ['date', 'name', 'address']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

  }
}
</script>

<style scoped>
  .box-card{
    position: relative;
  }
  /* 分页栏 */
  .page-block {
    /* background-color: lightgreen; */
    padding: 20px 0px;
    text-align: center;
  }
</style>
