//引入express
const express = require('express');
const path = require('path');
const app = express();

const http = require('http');

const querystring = require('querystring')
const Jdata = require('./public/data.json')
//静态资源部分

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function (req,res) {


    res.send('登陆页面:http://localhost:8081/login'+
        " "+
        '文章列表页面:http://localhost:8081/list');
})
app.get('/login',function (req,res) {
    console.log(__dirname)
    res.sendFile(__dirname+'/public/login.html');
})
app.get('/list',function (req,res) {
    console.log(__dirname)

    console.log(req.headers.cookie)
    var cooki = req.headers.cookie

    if(cooki == "666666"){
        res.sendFile(__dirname+'/public/list.html');
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'})
        res.end('请先登录')
    }

})

app.post('/logining',function (req,res) {
    console.log('logining访问')
    let body = '';
    req.on('data', function (chunk) {

        body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        console.log("chunk:",chunk);
        body = querystring.parse(body);
        console.log(body)
    });
    req.on('end',function () {
        console.log(Jdata.users)
        //从文件中读取账号密码
        if (body.username == Jdata.users[0].username && body.password == Jdata.users[0].password){
            console.log('密码正确');
            //设置cookie666666
            res.writeHead(200, {'Set-Cookie':'666666'});
            res.end()

        } else {
            res.writeHead(401,{"Content-Type":"text/html;charset=utf-8"});
            console.log('密码错误');
            var err = {feedcode:0};
            res.end(JSON.stringify(err))
        }
    });

})
app.post("/getCldate",function (req,res) {
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    console.log(Jdata)
    let datastr =  JSON.stringify(Jdata.chapterList);
    console.log(datastr);
    res.end(datastr)
})

http.createServer(app).listen(8081,function () {
    console.log("应用地址:http://localhost:8081/")
});
