const examList = [
  {
    examName: '期中模拟考试',
    examScore: 100,
    time: 60,
    id: 1,
    status:false,
    hasDo: false,
    hasBook: false,
    importance: 5,
    examContentList: [
      {
        type: 1,
        examContent: '小鸡有几只脚?',
        ansContent: ['1只', '2只', '3只', '4只'],
        rightAns: ['2只'],
        myAns: [],
        score: 20,
        yourScore: 0
      },
      {
        type: 2,
        examContent: '大象有多少千克？',
        input: '',
        ansContent: [],
        myAns: [],
        rightAns: ['1000'], yourScore: 0,
        score: 20
      },
      {
        type: 0,
        examContent: '人民币有以下哪几种面值',
        input: '',
        ansContent: ['5元', '8元', '7元', '10元', '15元', '20元'],
        rightAns: ['5元', '10元', '20元'],
        myAns: [], yourScore: 0,
        score: 20
      },
      {
        type: 1,
        examContent: ' 在Word的编辑状态，下列四种组合键中，可以从当前输入汉字状态转换到输入ASCII字符状态的组合键是',
        input: '',
        ansContent: ['Ctrl+空格键', 'Alt+Ctrl', 'Shift+空格键', 'Alt+空格键'],
        rightAns: ['Ctrl+空格键'],
        myAns: [], yourScore: 0,
        score: 20
      },
      {
        type: 1,
        examContent: '下列关于局域网拓扑结构的叙述中，不正确的是',
        input: '',
        ansContent: ['树型结构的数据采用单级传输，故系统响应速度较快', '星形结构的中心站发生故障时，会导致整个网络停止工作',
          '环形结构网络上的设备是串在一起的', '总线结构网络中，若某台工作站故障，一般不影响整个网络的正常工作'],
        rightAns: ['树型结构的数据采用单级传输，故系统响应速度较快'],
        myAns: [], yourScore: 0,
        score: 20
      }
    ]
  },
  {
    examName: '期末模拟考试',
    examScore: 100,
    id: 2,
    importance: 4,
    time: 60,
    hasDo: false,
    hasBook: false,
    examContentList: [
      {
        type: 1,
        examContent: '小鸡有几只脚?',
        ansContent: ['1只', '2只', '3只', '4只'],
        rightAns: [1],
        myAns: []
      },
      {
        type: 2,
        examContent: '大象有多少千克？',
        input: '',
        ansContent: [],
        myAns: [],
        rightAns: ['1000']
      },
      {
        type: 0,
        examContent: '人民币有以下哪几种面值',
        input: '',
        myAns: [],
        ansContent: ['5元', '8元', '7元', '10元', '15元', '20元'],
        rightAns: [0, 3, 5]
      }
    ]
  }
]
export default examList
