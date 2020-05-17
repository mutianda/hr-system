<template>
  <el-card class="box-card" body-style="padding: 5px 10px;border:0px;height:85vh;">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('begain')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="begain" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              上班
            </div>

            <el-tag v-if="todayInfo.begin_status==''" type="info">未打卡</el-tag>
            <el-tag v-if="todayInfo.begin_status=='0'" type="danger">{{ todayInfo.begin_time }}迟到</el-tag>
            <el-tag v-if="todayInfo.begin_status=='1'" type="success">正常</el-tag>

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
              下班
            </div>
            <el-tag v-if="todayInfo.finish_status==''" type="info">未打卡</el-tag>
            <el-tag v-if="todayInfo.finish_status=='0'" type="danger">{{ begin_time }}早退</el-tag>
            <el-tag v-if="todayInfo.finish_status=='1'" type="success">正常</el-tag>

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
              请假
            </div>
            <el-tag v-if="todayInfo.is_out=='1'" type="info">申请中</el-tag>
            <el-tag v-if="todayInfo.is_out=='2'" type="danger">请假中</el-tag>
            <el-tag v-if="todayInfo.is_out=='3'" type="success">已拒绝</el-tag>
            <!--          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('out')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="out" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              离职
            </div>
            <!--          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />-->
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="选择请假日期"
      :visible.sync="leaveDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-date-picker
        v-model="leaveTime"
        type="dates"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-M-d"
        placeholder="选择一个或多个日期"
        @change="changeDate"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="toAskforleave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择离职日期"
      :visible.sync="outDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="outForm" class="demo-form-inline" :rules="outRules">

        <el-form-item label="离职时间" prop="outTime">
          <el-date-picker
            v-model="outForm.outTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="离职原因" prop="outReason">
          <el-input v-model="outForm.outReason" type="textarea" placeholder="离职原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doOut">确 定</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="10">
      <el-col :span="7">
        <el-tag>通讯录</el-tag>
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
              width="100"
            />
            <el-table-column
              prop="user_phone"
              label="手机号"
              width="130"
            />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-tag>请假申请</el-tag>
        <el-card style="margin-top: 10px">
          <el-table
            :data="myLeave"
            style="width: 100%"
            :height="500"
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
        </el-card>
      </el-col>
      <el-col :span="10" :gutter="20">
        <el-tag>最新公告</el-tag>
        <div style="height: 500px;overflow-y: auto">

          <el-card v-for="(item,index) in tipsList" :key="index" style="margin: 10px 5px">
            <div style="text-align: center;margin: 10px;color: #555;font-size: 13px"><el-tag type="warning" style="font-size: 16px">{{item.title}}</el-tag><span style="padding-left: 50px"> {{ item.create_time }}</span></div>
            <div style="margin: 1px;color: #aaa">  {{item.content}}</div>
          </el-card>
        </div>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import CountTo from 'vue-count-to'
import { workerList, getMyLeave ,getTips} from '@/api/admin'


import { setBegin, setFinish, askforleave, outWork, setAll, askOutJob, getMyToday } from '@/api/myself/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      outForm: {
        outTime: '',
        outReason: ''
      },

      userList: [
      ],
      todayInfo: {
        begin_status: '',
        begin_time: '',
        finish_status: '',
        finish_time: '',
        id: 2795,
        is_out: '',
        today_time: '',
        user_id: ''
      },
      myLeave: [

      ],
      outRules: {
        outTime: [
          { required: true, message: '请选择离职时间', trigger: 'change' }
        ],
        outReason: [
          { required: true, message: '请输入离职原因', trigger: 'blur' },
          { min: 3, max: 165, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      leaveTime: [],
      tipsList:[],
      outDialogVisible: false,
      leaveDialogVisible: false
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    console.log(this.roles)
  },
  mounted() {

    this.togetMyToday()
    this.getWorkerList()
    this.getUserLeave()
    this.getTipsList()

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
    updateTips(data) {
      if (data.code == 1) {
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
    getTipsList(){
      getTips().then(res => {
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
    getUserLeave() {
      const data = {
        userId: this.user.id,
        pageSize: 1000,
        currentPage: 1,
        status: '',
        pageSizes: [10, 20, 30, 40, 50],
        total: 0
      }
      getMyLeave(data).then(res => {
        if (res.data) {
          this.myLeave = res.data.dataList
        }
        this.$message({
          type: res.code>0?'success':'error',
          message: res.msg
        })
      })
    },
    doOut() {
      const data = {
        userId: this.user.id,
        time: this.outForm.outTime,
        reason: this.outForm.outReason
      }
      askOutJob(data).then(res => {
        this.handleClose()
        this.$message({
          type: res.code>0?'success':'error',
          message: res.msg
        })
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
        if (res.code == 1) {
          this.todayInfo = res.data[0]
        } else {
          this.todayInfo = {}
        }
      })
    },
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
    tosetBegin() {
      const times = this.nowT()
      const data = {
        userId: this.user.id,
        time: times.time,
        status: times.time - 8.00 > 0 ? '0' : '1',
        today: times.today
      }
      console.log(data)

      setBegin(data).then(res => {
        this.togetMyToday()

        this.$message({
          type: res.code>0?'success':'error',
          message: res.msg
        })
      })
    },
    tosetFinish() {
      const times = this.nowT()
      const data = {
        userId: this.user.id,
        time: times.time,
        status: times.time - 18.00 > 0 ? '1' : '0',
        today: times.today
      }
      console.log(data)

      setFinish(data).then(res => {
        this.togetMyToday()
        this.$message({
          type: 'success',
          message: res.msg
        })
      })
    },
    toAskforleave() {
      const data = {
        userId: this.user.id,
        timeList: this.leaveTime
      }
      console.log(data)

      askforleave(data).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
      })
    },
    toOutWork() {
      const data = {
        userId: this.user.id
      }
      outWork(data).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
      })
    },
    tosetAll() {
      setAll().then(res => {
        console.log(res)
      })
    },
    handleSetLineChartData(type) {
      if (type == 'leave') {
        this.leaveDialogVisible = true
      }
      if (type == 'out') {
        this.outDialogVisible = true
      }
      if (type == 'begain') {
        this.tosetBegin()
      }
      if (type == 'finish') {
        this.tosetFinish()
      }
      // this.$emit('handleSetLineChartData', type)
    },
    handleClose() {
      this.leaveDialogVisible = false
      this.leaveTime = []
      this.outDialogVisible = false
    },
    changeDate(b) {
      this.leaveTime = b.filter(item => {
        const date = new Date(item)
        const week = date.getDay()
        if (week != 0 && week != 6) {
          return item
        }
      })
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
      background: #eee;
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

