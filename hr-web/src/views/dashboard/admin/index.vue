<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('begain')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="begain" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日上班
            </div>

            <el-tag :type="todayInfo.lateN?'danger':'success'">{{todayInfo.lateN}}人迟到</el-tag>

            <!--          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('finish')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="finish" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日下班
            </div>

            <el-tag  :type="todayInfo.earlyN?'danger':'success'">{{todayInfo.earlyN}}人早退</el-tag>


            <!--          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('leave')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="leave" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日请假
            </div>

            <el-tag :type="todayInfo.leaveN?'danger':'success'">{{todayInfo.leaveN}}人请假中</el-tag>

            <!--          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />-->
          </div>
        </div>
      </el-col>
<!--      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <div class="card-panel" @click="handleSetLineChartData('out')">-->
<!--          <div class="card-panel-icon-wrapper icon-shopping">-->
<!--            <svg-icon icon-class="out" class-name="card-panel-icon" />-->
<!--          </div>-->
<!--          <div class="card-panel-description">-->
<!--            <div class="card-panel-text">-->
<!--              离职-->
<!--            </div>-->
<!--            &lt;!&ndash;          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />&ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
    </el-row>



    <el-row :gutter="10">
      <el-col :span="5">
        <el-tag>通讯录</el-tag><el-tag type="success" @click="addTips"><i class="el-icon-plus" /></el-tag>
        <el-card style="margin-top: 10px">

          <el-table
            :data="userList"
            style="width: 100%"
            :height="500"
            :row-class-name="tableRowClassName"
          >

            <el-table-column
              prop="user_name"
              label="姓名"
              width="80"
            />
            <el-table-column
              prop="user_phone"
              label="手机号"
              min-width="130"
            />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-tag>待办</el-tag>
        <el-card style="margin-top: 10px">

          <el-table
            :data="leaveList"
            style="width: 100%"
            :height="500"
          >
            <el-table-column
              prop="user_name"
              label="姓名"
              min-width="80"
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
              label="操作"
              align="center"
              min-width="150"
            >
              <template slot-scope="scope">
                <el-button v-if="scope.row.is_out==1" type="success" size="mini" @click="agreeLeave(scope.row,2)">同意</el-button>
                <el-button v-if="scope.row.is_out==1" type="warning" size="mini" @click="agreeLeave(scope.row,3)">拒绝</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10" :gutter="20">
        <el-tag>最新公告</el-tag> <el-tag type="success" @click="addTips"><i class="el-icon-plus" /></el-tag>
        <div style="height: 500px;overflow-y: auto">

          <el-card v-for="(item,index) in tipsList" :key="index" style="margin: 10px 5px">
            <div style="text-align: center;margin: 10px;color: #555;font-size: 13px"><el-tag type="warning" style="font-size: 16px">{{item.title}}</el-tag><span style="padding-left: 50px"> {{ item.create_time }}</span></div>
            <div style="margin: 1px;color: #aaa">  {{item.content}}</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;margin-top: 50px">
      <line-chart :chart-data="lineChartData" />
    </el-row>
<!--    <el-row :gutter="32">-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <raddar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <pie-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <bar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    <el-row :gutter="8">-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
<!--        <transaction-table />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <todo-list />-->
<!--      </el-col>-->
<!--      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
<!--        <box-card />-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-dialog
      title="添加公告"
      :visible.sync="addTipsDialog"
      width="50%"
      :before-close="handleDialogClose"
    >
      <el-form  :model="tipsForm" class="demo-form-inline" :rules="tipsRule">

        <el-form-item label="标题" prop="title">
          <el-input v-model="tipsForm.title" placeholder="标题" style="width: 200px" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="tipsForm.content" type="textarea" placeholder="内容" style="width: 200px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="toAddTips">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { workerList, getAllUserLeaveList, agreeLeaveApi, addTips ,getTips,computSign} from '@/api/admin'
import { getMyToday } from '@/api/myself/index'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      userList: [],
      leaveList: [],
      tipsList:[],
      user: '',
      tipsForm: {
        title: '',
        content: ''
      },
      todayInfo: {

        lateN:0,
        earlyN:0,
        leaveN:0
      },
      tipsRule: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, max: 165, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      addTipsDialog: false
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    console.log(this.roles)
  },
  mounted() {
    this.getWorkerList()
    this.getUserLeave()
    this.getTipsList()
    this.togetMyToday()
    this.$socket.emit('login', { userid: this.user.id, username: this.user.user_name })

  },
  sockets: {
    connect() {
      this.id = this.$socket.id
      console.log('连接成功')
      this.$socket.emit('login', { userid: this.user.id, username: this.user.user_name })
      // 监听connect事件
    },
    login(data){
      console.log(data)
    },
    logout(data){
      console.log(data)
    },
    sendToC(data){
      console.log(data)
    },
    message(data) {     // 监听message事件，方法是后台定义和提供的
      console.log(data)
    },
    updateTips(data){
      if(data.code==1){
        this.$notify({
          title: '通知',
          message: '有新公告',
          duration: 0,
          type: 'success'
        });
        this.getTipsList()
      }
    }
  },
  methods: {
    nowT() {
      const now = new Date()
      const times = {}

      now.getYear() // 当前年份
      now.getFullYear() // 完整的年月日（xx年，xx月，xx日）
      now.getMonth() // 当前的月份(0-11,0代表1月)         // 获取当前的月份是oDay.getMonth()+1;   <br>oDay.getDate(); //当前的日(1-31)
      now.getDay() // 当前的星期X(0-6,0代表星期天)
      now.getTime() // 当前的时间(从1970.1.1开始的毫秒数)
      now.getHours() // 当前的小时数(0-23)
      now.getMinutes() // 当前的分钟数(0-59)
      now.getSeconds() // 当前的秒数(0-59)
      times.time = (now.getHours() > 9 ? '' : '0') + now.getHours() + '.' + (now.getMinutes() > 9 ? '' : '0') + now.getMinutes()
      times.today = now.getFullYear() + '-' + (now.getMonth() > 8 ? '' : '0') + (now.getMonth() + 1) + '-' + (now.getDate() > 9 ? '' : '0') + now.getDate()
      return times
    },
    addTips() {
      this.addTipsDialog = true
      this.tipsForm = {
        title: '',
        content: ''
      }
    },
    togetMyToday() {
      const times = this.nowT()
      const data = {
        userId: this.user.id,
        time: times.time,
        status: times.time - 8.00 > 0 ? '0' : '1',
        today: times.today
      }

      console.log(data)
      getMyToday(data).then(res => {
        console.log(res)
        if (res.code == 1&&res.data.length) {
         res.data.forEach(item=>{
           if(item.begin_status==0){
             this.todayInfo.lateN++
           }
           if(item.finish_status==0){
             this.todayInfo.earlyN++
           }
           if(item.is_out==2){
             this.todayInfo.leaveN++
           }
         })

        } else {
          this.todayInfo={

            lateN:0,
              earlyN:0,
              leaveN:0
          }
        }
      })
    },
    getTipsList(){
      getTips(this.tipsForm).then(res => {
        this.handleDialogClose()
        if (res.code) {
          this.tipsList = res.data

        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    handleDialogClose(){
      this.addTipsDialog = false
      this.tipsForm = {
        title: '',
        content: ''
      }
    },
    toAddTips() {
      addTips(this.tipsForm).then(res => {
        this.handleDialogClose()
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
    getUserLeave() {
      const data = {
        userId: this.user.id,
        role: this.user.role,
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      }

      getAllUserLeaveList(data).then(res => {
        if (res.data) {
          this.leaveList = res.data.dataList.filter(item => {
            return item.is_out == 1
          })
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

    tableRowClassName({ row, rowIndex }) {
      if (row.workStatus == 0) {
        return 'warning-row'
      } else if (row.role < 2) {
        return 'success-row'
      }
      return ''
    },
    getWorkerList() {
      const data = {
        userId: this.user.id,
        pageSize: 1000,
        currentPage: 1,
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      }
      workerList(data).then(res => {
        console.log(res)
        if (res.data) {
          this.userList = res.data.dataList
        }
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.el-table .warning-row {
    background: #b6b7b9;
    color: #fff;
  }

  /deep/.el-table .success-row {
    background: #1695f9;
    color: #fff;

  }
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
