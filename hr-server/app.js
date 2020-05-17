var conn=require("./mysql.js");
var express = require('express');
var app = express();
var socket = require("./socket.js");
app.all('*', function(req, res, next) {             //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Token,x-token,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
const bodyParser = require('body-parser')
let login = true;
// json请求
app.use(bodyParser.json())
// 表单请求
app.use(bodyParser.urlencoded({extended: false}))

app.post('/register', (req, res) => {
    let { username,phone ,password,email,role,salary } = req.body
    let arr = [username , password, phone, role, salary, '1', email]
    let newarry = arr.map(citem => {
        return "'" + citem + "'"
    })
    let sql = "INSERT INTO user ( user_name , user_password , user_phone , role , salary , workStatus ,user_email ) VALUES ( "+newarry.toLocaleString() +")"
    console.log(sql)
    conn.query(sql, (e, r) => {
        console.log(e)
        if(r&&r.insertId){
            res.json(new Result({ msg:'创建成功' }))

        }else {
            res.json(new Result({ msg:'创建失败',code:0 }))

        }


    })


// let sql = "INSERT INTO user ( '张员工','111111','15077877933','5','5000','1','1') VALUES  ( user_name , user_password , user_phone , ole , salary , workStatus ,user_email ) "


})

app.post('/updateUser', (req, res) => {
    let { username,phone ,password,email,role,salary ,userId} = req.body

    let sql = "UPDATE user SET user_name ='" + username + "' ,user_phone='" + phone + "',user_password='" + password + "',user_email='" + email + "',role='" + role + "',salary='" + salary + "'  where id = " + userId
    console.log(sql)
    conn.query(sql, (e, r) => {

        if(r){
            res.json(new Result({ msg:'更新成功' }))

        }else {
            res.json(new Result({ msg:'更新失败',code:0 }))

        }


    })


// let sql = "INSERT INTO user ( '张员工','111111','15077877933','5','5000','1','1') VALUES  ( user_name , user_password , user_phone , ole , salary , workStatus ,user_email ) "

})
app.post('/createTips', (req, res) => {
    let { title,content } = req.body

        let sql = `INSERT INTO tips ( title , content  ) VALUES (${'\''+title+'\''},${'\''+content+'\''} )`
        console.log(sql)
        conn.query(sql, (e, r) => {
            console.log(e)
            if(r&&r.insertId){
                res.json(new Result({ msg:'创建成功' }))
                socket.emit('updateTips', {code:1});

            }else {
        res.json(new Result({ msg:'创建失败',code:0 }))

    }


        })
// let sql = "INSERT INTO user ( '张员工','111111','15077877933','5','5000','1','1') VALUES  ( user_name , user_password , user_phone , ole , salary , workStatus ,user_email ) "

})
app.get('/login', (req, res) => {
    let { userphone ,password } = req.query
    console.log(userphone,password)
    let sql = "SELECT * FROM user where user_phone ="+userphone+" and user_password="+password
    conn.query(sql, (e, r) => {
        console.log(e)
        console.log(r)
       if(e){
           res.json(new Result({msg:'登录出错'}))

       }
        if(r.length>0){
            r[0].token = 'token'
            r[0].password=''
            res.json(new Result({ data: r[0],code:1 }))
        }else {
            res.json(new Result({msg:'登录出错',code:0 }))
        }

    })
})

app.get('/setAll', (req, res) => {


    let sql = "SELECT * FROM user where role != '0'"
    let n = 0
    conn.query(sql, (e, r) => {
        console.log(e);
        console.log(r);
        if(r.length>0){
            let allUser = r
            let allTime = new Array(30).fill('2020-04-')
                allTime.forEach((titem,ti)=>{
                    allUser.forEach((item,index)=>{

                    var arr = ['7.50','1','18.01','1','0' ,item.id ,titem+(ti>8?'':'0')+(ti-0+1)]
                    let newarry = arr.map(citem=>{
                        return "'"+citem+"'"
                    })
                    let sqlInsert = "INSERT INTO signed ( begin_time , begin_status , finish_time , finish_status , is_out , user_id ,today_time ) VALUES ( "+newarry.toLocaleString() +")"
                    conn.query(sqlInsert,(e,r)=>{
                        let data ={}
                        console.log(sqlInsert);
                        if(e){
                            data = e
                        }else {
                            data = r
                        }

                        if(data.insertId>0){
                            n++
                        }

                    })
                })


            })
        }
        res.json(new Result({msg: '打卡成功'}))

    })

})
app.get('/computeSalary', (req, res) => {
    const now = new Date()

    const time = now.getFullYear()+'-'+(now.getMonth()>8?'':'0')+now.getMonth()

    computeSalary(time,res)


})


//批量更新手机号
function computeSalary(time,res) {
    let pros = [];
    let sqls = ["SELECT * FROM signed where today_time LIKE ?","SELECT * FROM user where workStatus !=0"]

    sqls.forEach(item=>{
        pros.push(new Promise(function(resolve,reject){

            conn.query(item, ['%'+time+'%'],(e, r) => {
                resolve(r);
            })
        }));
    });
    Promise.all(pros).then((resu)=>{
        console.log('批量更新成功');
        console.log(resu);
        const userList = resu[1]
        const signList = resu[0]
        new Date('2020-05-14').getDay()
        new Date('2020','05','0').getDate()
        const times = time.split('-')
        const days =  new Date(times[0],times[1],'0').getDate()
        const DayList = new Array(days).fill(1)
        let workDayList = DayList.filter((item,index)=>{
            const iswork =new Date(item+(index-0+1)).getDay()
            return iswork!=0&&iswork!=6
        })
        const newSalary = []
        userList.forEach(item1=>{
            const data = {
                leaveN:0,
                lateN:0,
                earlyN:0
            }
            signList.forEach(item2=>{
                if(item1.id==item2.user_id){
                    if(item2.is_out==2){
                        data.leaveN++
                    }
                    if(item2.begin_status ==0){
                        data.lateN++
                    }
                    if(item2.finish_status==0){
                        data.earlyN++
                    }

                }
            })
            newSalary.push(Object.assign(item1,data))


        })
        newSalary.forEach(item=>{
            const money= item.salary/days*(workDayList.length-item.leaveN) - 10*(item.lateN-0)-10*(item.earlyN-0)
            const data = [item.id+'',money.toFixed(2)+'',time,'0',item.lateN+'',item.earlyN+'',item.leaveN+'']
            console.log(data.toLocaleString());
            let isql ="INSERT INTO salary ( user_id , money_num , salary_time , salary_status , before_num , after_num ,leave_num ) VALUES ( ?,?,?,?,?,?,?)"
            conn.query(isql, data,(e, r) => {

                if(r){
                    console.log('插入成功')
                }else {
                    console.log('插入失败')

                }

            })
        })
        res.json(new Result({msg:'计算成功',}));
    },()=>{
        console.log('更新失败');
        res.json(new Result({msg:'计算失败',code:0}));

    });
}



app.get('/computSign', (req, res) => {
    let { time } = req.query
    querySign(res,time)


})
function querySign(res,time) {


    let sql = `SELECT * FROM signed where today_time LIKE ?`
    console.log(sql);
    conn.query(sql, ['%'+time+'%'],(e, r) => {
        if(r&&r.length){
            let data={}
            r.forEach(item=>{
                const a = {
                    lateN:0,
                    earlyN:0,
                    leaveN:0
                }
                if(!data[item.today_time]){
                    data[item.today_time] = a
                }
                if(item.begin_status==0){
                    data[item.today_time].lateN++
                }
                if(item.finish_status==0){
                    data[item.today_time].earlyN++

                }
                if(item.is_out==2){
                    data[item.today_time].leaveN++

                }
            })
            res.json(new Result({msg: '统计成功',data,}))

        }else {
            res.json(new Result({msg: '统计失败',code:0}))

        }
    })
}

app.get('/selectWork', (req, res) => {


    let sql = "SELECT * FROM signed "
    let n = 0
    conn.query(sql, (e, r) => {
        console.log(e)
        console.log(r);
        if(r.length>0){
            let allWork = r
            let resData = []
            allWork.map((item,index)=>{
              let selectUser = "SELECT * FROM user where id =  "+item.user_id

                let user={}
                conn.query(selectUser, (e, cr) => {
                    user = cr[0]
                    console.log(user)
                    let a =Object.assign(user,item)
                        resData.push(a)

                })
                if(index==allWork.length-1){
                    res.json(new Result({data: resData}))

                }

            })
        }

    })

})

app.get('/setBegin', (req, res) => {
    let { userId ,time ,status,today} = req.query
    let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+today+"'"
    conn.query(sql, (e, r) => {
        if (r.length > 0) {
            let sqls = " UPDATE signed SET begin_time='" + time + "' ,begin_status='" + status + "'  where user_id = '" + userId + "' and today_time = '" + today + "'"
            conn.query(sqls, (e, r) => {
                    console.log(sqls);
                    if (e) {
                        data = e
                    } else {
                        data = r
                    }
                    console.log(r);
                if(r&&r.affectedRows>0){
                    res.json(new Result({ msg:'打卡成功' }))
                }else {
                    res.json(new Result({ msg:'打卡失败' }))

                }

                }
            )
        }

        else {
            var arr = [time,status,'','','0' ,userId ,today]
            let newarry = arr.map(item=>{
                return "'"+item+"'"
            })
            let sqlInsert = "INSERT INTO signed ( begin_time , begin_status , finish_time , finish_status , is_out , user_id ,today_time ) VALUES ( "+newarry.toLocaleString() +")"
            conn.query(sqlInsert,(e,r)=>{
                let data ={}
                console.log(sqlInsert);
                if(r&&r.insertId>0){
                    res.json(new Result({ msg:'打卡成功' }))
                }else {
                    res.json(new Result({ msg:'打卡失败' }))

                }

            })
        }

    })

})


app.get('/setFinish', (req, res) => {
    let { userId ,time ,status,today} = req.query
    let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+today+"'"
    conn.query(sql, (e, r) => {

        if(r.length>0){
            let sqls = " UPDATE signed SET finish_time='"+time+"' ,finish_status='"+status+"' where user_id = '"+userId+"' and today_time = '"+today+"'"
            conn.query(sqls,(e,r)=>{
                if(r&&r.affectedRows>0){
                    res.json(new Result({ msg:'打卡成功' }))
                }else {
                    res.json(new Result({ msg:'打卡失败' }))

                }

            })
        }else {
            var arr = ['','',time,status,'0' ,userId ,today]
            let newarry = arr.map(item=>{
                return "'"+item+"'"
            })
            let sql = "INSERT INTO signed ( begin_time , begin_status , finish_time , finish_status , is_out , user_id ,today_time ) VALUES ( "+newarry.toLocaleString() +")"
            conn.query(sql,(e,r)=>{

                if(r&&r.insertId>0){
                    res.json(new Result({ msg:'打卡成功' }))
                }else {
                    res.json(new Result({ msg:'打卡失败' }))

                }


            })
        }

    })

})
app.get('/askOutJob', (req, res) => {
    let { userId ,time ,reason} = req.query
    var arr = [userId ,time,reason,'0']
    let newarry = arr.map(item=>{
        return "'"+item+"'"
    })
    let sql = "INSERT INTO outjob (  user_id ,out_time  ,out_reason, out_status  ) VALUES ( "+newarry.toLocaleString() +")"
    conn.query(sql,(e,r)=>{
        let data ={}
        if(e){
            data = e
        }else {
            data = r
        }
        if(data.insertId>0){
            res.json(new Result({ msg:'申请成功' }))
        }else {
            res.json(new Result({ msg:'申请成功' }))

        }


    })

})
app.post('/askforleave', (req, res) => {
    let { userId } = req.query
    let timeList = req.body
    console.log(timeList);
    // const timeList = params.split(',')timeList
    timeList.forEach(item=>{
        // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"
        var arr = ['','','','','1' ,userId ,item]
        let newarry = arr.map(item=>{
            return "'"+item+"'"
        })
        let sql = "INSERT INTO signed ( begin_time , begin_status , finish_time , finish_status , is_out , user_id ,today_time ) VALUES ( "+newarry.toLocaleString() +")"
        conn.query(sql,(e,r)=>{
            let data ={}
            if(e){
                data = e
            }else {
                data = r
            }


        })

    })
    const msg = '申请成功'
    res.json(new Result({ msg }))


})
app.get('/getTips', (req, res) => {
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"

    let sqls = " SELECT * FROM tips  ORDER BY id DESC"

    conn.query(sqls,(e,r)=>{

        if(r.length>0){
            const msg = '查询成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '查询失败'
            res.json(new Result({ msg ,data:e }))
        }

    })

})
app.get('/myLeave', (req, res) => {
    let { userId } = req.query
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"

    let sqls = " SELECT * FROM signed where user_id = "+userId+" and is_out != '0' ORDER BY id DESC"

    conn.query(sqls,(e,r)=>{
        let data ={}

        if(r.length>0){
            const msg = '查询成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '查询失败'
            res.json(new Result({ msg ,data:e }))
        }

    })

})


app.get('/getMyToday', (req, res) => {
    let { userId ,today} = req.query
    // const timeList = params.split(',')timeList
    let sqls =''
    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"
    if(userId==1){
        sqls = " SELECT * FROM signed where user_id != ? and today_time LIKE ? "

    }else {
        sqls = " SELECT * FROM signed where user_id = ? and today_time LIKE ? "

    }


    conn.query(sqls,[userId,"%"+today+"%"],(e,r)=>{


        if(r&&r.length>0){
            const msg = '查询成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '查询失败'
            res.json(new Result({ msg ,data:null,code:0 }))
        }

    })


})
app.get('/mySign', (req, res) => {
    let { userId } = req.query
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"

    let sqls = " SELECT * FROM signed where user_id = "+userId+" and is_out != '2'  ORDER BY id DESC"

    conn.query(sqls,(e,r)=>{
        let data ={}

        if(r.length>0){
            const msg = '查询成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '查询失败'
            res.json(new Result({ msg ,data:e }))
        }

    })


})

//查询考勤接口
app.get('/getMyLeave',(req,res)=>{
    //未传参数 则默认第一页 6条
    let {currentPage=1,pageSize=10,userId,status} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sql =''
    if(status){
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id where b.id = ${userId} and a.is_out = ${status} ORDER BY a.id DESC `;

    }else {
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id where b.id = ${userId} and a.is_out != '0' ORDER BY a.id DESC `;


    }

    console.log(sql);
    conn.query(sql, (e, r) => {

        if(r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,
            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })

});
app.get('/mySalary', (req, res) => {
    let { userId } = req.query
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"

    let sqls = " SELECT * FROM salary where user_id = "+userId

    conn.query(sqls,(e,r)=>{
        let data ={}

        if(r.length>0){
            const msg = '查询成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '查询失败'
            res.json(new Result({ msg ,data:e }))
        }

    })


})

app.get('/workerList', (req, res) => {
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"
    let {currentPage=1,pageSize=10,userId} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sqls = " SELECT * FROM user where role != '0'"
    if(userId>2){
        res.json(new Result({msg:'请求失败',data:''}));

    }

    conn.query(sqls,(e,r)=>{
        let data ={}
        if(r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,

            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })


})





//lianjun

//查询考勤接口
app.get('/getAllUserSign',(req,res)=>{
    //未传参数 则默认第一页 6条
    let {currentPage=1,pageSize=10,userId} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sql =''
    if(userId>1){
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id where b.id = ${userId} and a.is_out = '0' ORDER BY a.id DESC `;;
    }else {
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id  where  a.is_out = '0' ORDER BY a.id DESC`;

    }
    console.log(sql);
    conn.query(sql, (e, r) => {

        if(r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,

            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })

});


//查询考勤接口
app.get('/getAllUserLeave',(req,res)=>{
    //未传参数 则默认第一页 6条
    let {currentPage=1,pageSize=10,userId,role} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sql =''
    if(role>1){
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id where b.id = ${userId} and a.is_out != '0' ORDER BY a.id DESC `;;
    }else {
        sql =  `select * from signed as a INNER JOIN \`user\` as b on a.user_id = b.id where a.is_out != '0' and role > ${role} ORDER BY a.id DESC`;

    }
    console.log(sql);
    conn.query(sql, (e, r) => {

        if(r&&r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,
            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })

});


//查询离职接口
app.get('/queryquit',(req,res)=>{
    //未传参数 则默认第一页 6条
    let {pageIndex=0,pageSize=6} = req.query;

    let startIndex = pageSize * pageIndex;
    let sql = `select * from \`user\` where \`user\`.workStatus = 0 limit ${startIndex},${pageSize}`;
    conn.query(sql, (e, r) => {
        res.json(new Result({msg:'请求成功',data:r}));
    })

});
//查询薪水接口
app.get('/selectSalary',(req,res)=>{
    //未传参数 则默认  第一页 6条
    let {currentPage=1,pageSize=10,userId} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sql =''
    if(userId>1){
       sql = `select * from salary as a INNER JOIN \`user\`  as b on a.user_id = b.id where a.user_id = ${userId}`;
    }else {
        sql = `select * from salary as a INNER JOIN  \`user\`  as b on a.user_id  = b.id  where role !=0 `;

    }
    conn.query(sql, (e, r) => {
        if(r&&r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,

            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })

});
// 发放薪水接口

app.get('/getSalary',(req,res)=>{
    let {salaryId} = req.query;

    let sql = 'UPDATE salary set salary_status = 1 where salary_id = '+salaryId;
    conn.query(sql, (e, r) => {
        if(r){
            res.json(new Result({msg:'确认工资成功'}));

        }else {
            res.json(new Result({msg:'确认工资失败',code:0}));

        }
    })
});
//查询考勤接口
app.get('/getAllUserOut',(req,res)=>{
    //未传参数 则默认第一页 6条
    let {currentPage=1,pageSize=10} = req.query;
    let startIndex = pageSize * (currentPage-1);
    let sql =''
    sql =  `select * from outjob as a INNER JOIN \`user\` as b on a.user_id = b.id  ORDER BY a.out_time DESC`;

    // if(role>1){
    //     sql =  `select * from outjob as a INNER JOIN \`user\` as b on a.user_id = b.id where b.id = ${userId} and a.is_out != '0' ORDER BY a.id DESC `;;
    // }else {
    //     sql =  `select * from outjob as a INNER JOIN \`user\` as b on a.user_id = b.id where a.is_out != '0' and role > ${role} ORDER BY a.id DESC`;
    //
    // }
    console.log(sql);
    conn.query(sql, (e, r) => {

        if(r&&r.length>0){
            let dataList = r.slice(startIndex,pageSize-0+startIndex)
            const data = {
                total:r.length,
                currentPage:currentPage,
                pageSize:pageSize,
                dataList,
            }
            res.json(new Result({msg:'请求成功',data:data}));
        }else {
            res.json(new Result({msg:'请求失败',data:''}));
        }

    })

});
app.get('/outWork', (req, res) => {
    let { userId } = req.query
    // const timeList = params.split(',')timeList

    // let sql = "SELECT * FROM signed where user_id = '"+userId+"' and today_time = '"+item+"'"

    let sqls = " UPDATE user SET workStatus= '0' where id = '"+userId+"'"

    conn.query(sqls,(e,r)=>{
        let data ={}

        if(r.changedRows>0){
            const msg = '申请成功'
            res.json(new Result({ msg,data:r }))
        }else {
            const msg = '申请失败'
            res.json(new Result({ msg ,data:e }))
        }

    })
})

// 请假同意
app.get('/agreeLeave', (req, res) => {
    let { signId ,agree,time} = req.query

    let sql = ` UPDATE signed SET is_out= ${agree} where user_id = ${signId} and today_time = ${'\''+time+'\''}`
    console.log(sql);
    conn.query(sql,(e,r)=>{
        if(e){
            const msg = '操作失败'
            res.json(new Result({ msg,code:0 }))
        }else {
            const msg = '操作成功'
            res.json(new Result({ msg }))
        }
    })

})

// 请假同意
app.get('/agreeOut', (req, res) => {
    let { outId ,agree,time} = req.query

    let sql = ` UPDATE outjob SET out_status = ${agree} where user_id = ${outId} and out_time = ${'\''+time+'\''}`
    console.log(sql);
    conn.query(sql,(e,r)=>{
        if(e){
            const msg = '操作失败'
            res.json(new Result({ msg,code:0 }))
        }else {
            const msg = '操作成功'
            res.json(new Result({ msg }))
        }
    })

})



app.post('/updatePhone', (req, res) => {

    let phoneList = req.body
    // const timeList = params.split(',')timeList
    toupdatePhone(phoneList,res)

})
//批量更新手机号
function toupdatePhone(reset,res) {
    let pros = [];
    let sql = "update `user` set user_phone = ? where user_name = ?";
    let data = null;

    reset.forEach(item=>{
        pros.push(new Promise(function(resolve,reject){
            data = [item.phone,item.username];
            conn.query(sql, data,(e, r) => {
                resolve();
            })
        }));
    });
    Promise.all(pros).then(()=>{
        console.log('批量更新成功');

        res.json(new Result({msg:'更新成功'}));
    },()=>{
        console.log('更新失败');
        res.json(new Result({msg:'更新失败',code:0}));

    });
}



function Result ({ code = 1, msg = '', data = {} }) {
    this.code = code;
    this.msg = msg;
    this.data = data;
}
//配置服务端口
var server = app.listen(3002,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s',host,port)
})
