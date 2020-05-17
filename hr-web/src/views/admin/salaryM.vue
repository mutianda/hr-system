<template>
  <el-card class="box-card" body-style="padding: 5px 10px;border:0px;height:100%;">
    <el-row>

      <el-col :span="6">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleDownload">导出当前</el-button>
      </el-col>
      <el-col :span="6">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="tocomputeSalary">计算上月工资</el-button>
      </el-col>
      <el-col :span="8">
        <el-button size="small" type="primary" icon="el-icon-search" @click="subSearchForm('searchForm')" @keyup.enter="subSearchForm">查询</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
      prop="salary_time"
      label="薪资月份"
      min-width="180"
      align="center"
    />
      <el-table-column
        prop="user_name"
        label="员工名称"
        min-width="180"
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
        prop="salary"
        label="薪水"
        min-width="100"
        align="center"
      />

      <el-table-column
        prop="after_num"
        label="迟到"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="before_num"
        label="早退"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="leave_num"
        label="请假"
        min-width="100"
        align="center"
      />

      <el-table-column
        prop="money_num"
        label="实发薪水"
        min-width="100"
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
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
import { selectSalary, computeSalary } from '../../api/admin'

export default {
  name: 'SalaryList',
  data() {
    return {
      searchForm: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      },

      tableData: [],
      filename: '工资统计表'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  mounted() {
    this.getSalaryList()
  },
  methods: {
    getSalaryList() {
      const data = {
        userId: this.user.id,
        ...this.searchForm
      }
      selectSalary(data).then(res => {
        console.log(res)
        if (res.data) {
          this.tableData = res.data.dataList
          this.searchForm.pageSize = res.data.pageSize - 0
          this.searchForm.currentPage = res.data.currentPage - 0
          this.searchForm.total = res.data.total - 0
        }
      })
    },
    tocomputeSalary() {
      computeSalary().then(res => {
        console.log(res)
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getSalaryList()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getSalaryList()
    },
    // 带条件查询
    subSearchForm() {
      this.searchForm.total = 0

      this.searchForm.currentPage = 1
      this.getSalaryList()
    },
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名', '月份', '薪水', '迟到', '早退', '请假', '实发']
          const filterVal = ['user_name', 'salary_time', 'salary', 'after_num', 'before_num', 'leave_num', 'money_num']
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
    }

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
