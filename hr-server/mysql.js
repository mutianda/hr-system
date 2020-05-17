const mysql = require('mysql')

const option = {
    host: 'localhost',
    user: 'root',
    password: 'cgd',
    port: '3306',
    database: 'humanresource',
    connectTimeout: 5000, //连接超时
    multipleStatements: false //是否允许一个query中包含多条sql语句
}
const conn = mysql.createConnection(option);
module.exports=conn;

