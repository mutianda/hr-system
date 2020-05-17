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
          <el-tag :type="scope.row.role<3?'success':'warning'">{{ scope.row.role <3 ?'经理':'员工' }}</el-tag>
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
          <el-tag v-if="scope.row.is_out==1" type="warning">{{ '申请中' }}</el-tag>
          <el-tag v-if="scope.row.is_out==2" type="success">{{ '同意' }}</el-tag>
          <el-tag v-if="scope.row.is_out==3" type="danger">{{ '拒绝' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_out"
        label="操作"
        align="center"
        min-width="190"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.is_out==1" type="success" size="mini" @click="agreeLeave(scope.row,2)">同意</el-button>
          <el-button v-if="scope.row.is_out==1" type="warning" size="mini" @click="agreeLeave(scope.row,3)">拒绝</el-button>
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
import { getAllUserLeaveList, agreeLeaveApi } from '@/api/admin'

export default {
  name: 'LearnM',
  data() {
    return {
      searchForm: {
        pageSize: 10,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      },

      tableData: [],
      filename: '请假统计表'
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

      getAllUserLeaveList(data).then(res => {
        if (res.data) {
          this.tableData = res.data.dataList
          this.searchForm.pageSize = res.data.pageSize - 0
          this.searchForm.currentPage = res.data.currentPage - 0
          this.searchForm.total = res.data.total - 0
        }
        console.log(res)
      })
    },
    agreeLeave(row, agree) {
      const data = {
        signId: row.id,
        time: row.today_time,
        agree
      }
      agreeLeaveApi(data).then(res => {
        if (res.code) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getUserLeave()
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
