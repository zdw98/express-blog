var createError = require('http-errors');
var express = require('express');
var path = require('path');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/*
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./routes/users');





// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
*/
/*
* 添加的部分*/
const querystring = require('querystring')
const Jdata = require('./public/data.json')
//静态资源部分

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function (req,res) {


  res.send('登陆页面:http://localhost:3000/login'+
      " "+
      '文章列表页面:http://localhost:3000/list');
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
