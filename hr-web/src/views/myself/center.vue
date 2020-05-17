<template>
  <el-card class="box-card" body-style="padding: 5px 10px;border:0px;height:100%;">
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
            <span>未打卡</span>

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
            <span>未打卡</span>

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
  </el-card>
</template>

<script>
import CountTo from 'vue-count-to'
import { setBegin, setFinish, askforleave, outWork, setAll, getMyToday, askOutJob } from '@/api/myself/index'
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
      outDialogVisible: false,
      leaveDialogVisible: false
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    debugger
    console.log(this.roles)
  },
  mounted() {
    this.togetMyToday()
  },
  methods: {
    doOut() {
      const data = {
        userId: this.user.id,
        time: this.outForm.outTime,
        reason: this.outForm.outReason
      }
      askOutJob(data).then(res => {
        console.log(res)
      })
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
        this.$message({
          type: 'success',
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

