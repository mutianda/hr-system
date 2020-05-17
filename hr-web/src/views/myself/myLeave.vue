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
        prop="today_time"
        label="请假日期"
        min-width="120"
        align="center"
      />

      <el-table-column
        prop="is_out"
        label="请假状态"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_out==2?'success':'warning'">{{ scope.row.is_out==2?'申请成功':'申请中' }}</el-tag>

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
import { getMyLeave } from '../../api/admin'

export default {
  name: 'SalaryList',
  data() {
    return {
      searchForm: {
        pageSize: 10,
        currentPage: 1,
        status:'',
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      },

      tableData: [],
      filename: '请假表'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  mounted() {
    this.getUserLeave()
  },
  methods: {
    getUserLeave() {
      const data = {
        userId: this.user.id,
        role: this.user.role,
        ...this.searchForm
      }
      getMyLeave(data).then(res => {
        if (res.data) {
          this.tableData = res.data.dataList
          this.searchForm.pageSize = res.data.pageSize - 0
          this.searchForm.currentPage = res.data.currentPage - 0
          this.searchForm.total = res.data.total - 0
        }
        console.log(res)
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchForm.currentPage = 1

      this.getUserLeave()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getUserLeave()
    },
    // 带条件查询
    subSearchForm() {
      this.searchForm.total = 0

      this.searchForm.currentPage = 1
      this.getUserLeave()
    },
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['请假日期', '请假状态']
          const filterVal = ['today_time', 'is_out']
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
