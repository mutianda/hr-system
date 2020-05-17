<template>
  <div>
    <el-date-picker
      v-model="time"
      type="month"
      placeholder="选择月"
      format="yyyy 年 MM 月"
      value-format="yyyy-MM"
      @change="computSignCharts"
    >
    </el-date-picker>


    <div :class="className" ref="charts" :style="{height:height,width:width}" />

  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { workerList, getAllUserLeaveList, agreeLeaveApi, addTips, getTips, computSign } from '@/api/admin'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      time:'',
      timeList: [],
      lateList: [],
      earlyList: [],
      leaveList: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.time = (new Date()).getFullYear()+((new Date()).getMonth()>8?'-':'-0')+ (new Date().getMonth()+1)
    this.computSignCharts()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart() {
      this.chart = echarts.init(this.$refs.charts, 'macarons')
      this.setOptions()
    },
    computSignCharts() {
      computSign(this.time).then(res => {
        console.log(res)
        this.lateList = [0,0,0]
        this.earlyList = [0,0,0]
        this.leaveList = [0,0,0]
        this.timeList = [1,2,3,4,5]
        if (res.code) {
          this.timeList = Object.keys(res.data)
          Object.values(res.data).map(item => {
            this.lateList.push(item.lateN)
            this.earlyList.push(item.earlyN)
            this.leaveList.push(item.leaveN)
          })
          console.log(this.lateList,
          this.earlyList,
          this.leaveList)
          this.setOptions()
        }else {
          this.setOptions()
        }
      })
    },
    setOptions() {
      this.chart.setOption({
        xAxis: [{
          type: 'category',
          data: this.timeList,
          axisTick: {
            alignWithLabel: true
          }
        }],
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [ '迟到','早退','请假']
        },
        series: [{
          name: '迟到', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'bar',
          data: this.lateList,

          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '早退',
          smooth: true,
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.earlyList,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          name: '请假',
          smooth: true,
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#faa629',
              lineStyle: {
                color: '#fad843',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.leaveList,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    }
  }
}
</script>
