<template>
  <el-card class="box-card" body-style="padding: 5px 10px;border:0px;height:100%;">
    <el-row>

      <el-col :span="2">
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleDownload">导出当前</el-button>
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
        prop="salary_time"
        label="薪资月"
        min-width="180"
        align="center"
      />
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
        label="早退"
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
        prop="salary_status"
        label="发放状态"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.salary_status==1?'success':'warning'">{{ scope.row.salary_status==0?'发放中':'发放完成' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="salary_status"
        label="操作"
        align="center"
        min-width="190"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.salary_status==0" type="success" size="mini" @click="togetSalary(scope.row,1)">同意</el-button>
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
  </el-card>
</template>

<script>
import { parseTime } from '@/utils'
import { mySalary, getSalary } from '../../api/myself'

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
      filename: '薪水表'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  mounted() {
    this.getMySalary()
  },
  methods: {
    getMySalary() {
      const data = {
        userId: this.user.id,
        ...this.searchForm
      }
      mySalary(data).then(res => {
        console.log(res)
        if (res.data && res.data.dataList) {
          if (res.data) {
            this.tableData = res.data.dataList
            this.searchForm.pageSize = res.data.pageSize - 0
            this.searchForm.currentPage = res.data.currentPage - 0
            this.searchForm.total = res.data.total - 0
          }
        }
      })
    },
    togetSalary(row, agree) {
      const data = {
        salaryId: row.salary_id,
        time: row.salary_time,
        status: 1
      }
      getSalary(data).then(res => {
        if (res.code) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getMySalary()
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
      this.getMySalary()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getMySalary()
    },
    // 带条件查询
    subSearchForm() {
      this.searchForm.total = 0

      this.searchForm.currentPage = 1
      this.getMySalary()
    },
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['月份', '薪水', '迟到', '早退', '请假', '实发']
          const filterVal = ['salary_time', 'salary', 'after_num', 'before_num', 'leave_num', 'money_num']
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
    getsalaryList() {

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
