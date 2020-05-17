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
        prop="user_name"
        label="姓名"
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
          <el-tag :type="scope.row.role<3?'success':'warning'">{{ scope.row.role<3?'经理':'员工' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_phone"
        label="手机 "
        min-width="180"
        align="center"
      />

      <el-table-column
         prop="today_time"
         label="日期"
         min-width="120"
         align="center"
       />
      <el-table-column
        prop="begin_time"
        label="早打卡"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="begin_status"
        label="早打卡状态"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.begin_status==1?'success':'danger'">{{ scope.row.begin_status==1?'正常':'迟到' }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column
        prop="finish_time"
        label="晚打卡"
        min-width="100"
        align="center"
      />
      <el-table-column
        prop="finish_status"
        label="晚打卡状态"
        min-width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.finish_status==1?'正常':'早退' }}</el-tag>

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
import { getAllUserSign } from '../../api/admin'

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
      filename: '考勤统计表'
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  mounted() {
    this.getUserSign()
  },
  methods: {
    getUserSign() {
      getAllUserSign(this.searchForm).then(res => {
        if (res.data) {
          this.tableData = res.data.dataList
          this.searchForm.pageSize = res.data.pageSize-0
          this.searchForm.currentPage = res.data.currentPage-0
          this.searchForm.total = res.data.total-0
        }
        console.log(res)
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.searchForm.currentPage = 1

      this.getUserSign()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.searchForm.currentPage = val
      this.getUserSign()
    },
    // 带条件查询
    subSearchForm() {
      this.searchForm.total = 0

      this.searchForm.currentPage = 1
      this.getUserSign()
    },
    handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名','打卡日期', '早打卡时间', '早打卡状态','晚打卡时间', '晚打卡状态']
          const filterVal = ['user_name','today_time', 'begin_time', 'begin_status','finish_time', 'finish_status']
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
