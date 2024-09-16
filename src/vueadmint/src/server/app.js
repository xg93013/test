var express = require('express');
var app = express();

// mysql
var mysql = require('mysql');
// 普通连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'petstore'
});
// connection.connect();


// 连接池
var poolCon = mysql.createPool({
    connectionLimit: 10, // 限制连接数
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'petstore'
})

var sql = 'SELECT * FROM store';

let results = []
let results2 = []

// poolCon.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//     if (err) throw err;
//     console.log('The solution is: ', rows[0].solution);
// });

poolCon.getConnection((err, connection) => {
    connection.query('SELECT * FROM store', (err, result) => {
        results = result
        // connection.release(); // 释放连接
    })

    connection.query('SELECT * FROM userinfo', (err, result) => {
        results2 = result
        connection.release(); // 释放连接
    })

})


// connection.query('use petstore');
//查

// connection.query(sql, function(err, result) {
//     if (err) {
//         console.log('[SELECT ERROR] - ', err.message);
//         return;
//     }
//     results = result
//     console.log('--------------------------SELECT----------------------------');
//     console.log(result);
//     console.log('------------------------------------------------------------\n\n');
// });

connection.end();

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    // res.header("Content-Security-Policy", "upgrade-insecure-requests");
    next();
});

app.get('/apis/123', function (req, res) {
    var fs = require("fs");

    // 异步打开文件
    console.log("准备打开文件！");
    // fs.open("input.txt", "r+", function (err, fd) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log("文件打开成功！");
    // });
    fs.writeFile('input.txt', '我是通 过fs.writeFile 写入文件的内容', function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("数据写入成功！");
        console.log("--------我是分割线-------------")
        console.log("读取写入的数据！");
        fs.readFile('input.txt', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("异步读取文件数据: " + data.toString());
        });
    });
    res.jsonp({ a: 2, b: 3 })
});

app.get('/apis/234', function (req, res) {
    res.status(200),
        res.json(results2)
});

//配置服务端口

var server = app.listen(8080, function () {

    // var host = server.address().address;
    // var port = server.address().port;
    host = '172.27.13.165';
    port = '8080';


    console.log('Example app listening at http://%s:%s', host, port);
});


// ngnix
// location / {
//     proxy_pass http://192.168.1.100:8082/;
//     proxy_set_header Host $host; 
//     proxy_set_header X-Forwarded-Proto  https;#指定跳转后的$scheme为https
// }