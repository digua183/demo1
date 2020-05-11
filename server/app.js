var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require("express-session");
var bodyParser = require('body-parser')
var allRouter = require('./routes/all');
var getRouter = require('./routes/get')
var cookieParser=require("cookie-parser")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});



app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser())

// express中是把session信息存储在内存中
// 配置session
app.use(session({
    secret:"dsafsafsfa", //设置签名秘钥 内容可以任意填写
    cookie:{ maxAge:80*1000 }, //设置cookie的过期时间，例：80s后    session和相应的cookie失效过期
    resave:true, //强制保存，如果session没有被修改也要重新保存
    saveUninitialized:false //如果原先没有session那么久设置，否则不设置
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use('/all', allRouter);
app.use('/get', getRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8080)

module.exports = app;