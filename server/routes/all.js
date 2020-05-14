var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');



// 点击
router.post('/login', function (req, res, next) {
  let name = req.body.username
  let password = req.body.password
  let sqlarr = [name, password]
  let sql = 'select * FROM user where userId=? and password = ?';

  db.dbConnect(sql, sqlarr, function (err, data) {
    if (data.length > 0) {
      req.session.username = name;
      res.send(data[0])
    } else {
      res.send({ status: "error" })
    }
  })
})

router.get('/getPersonalInfo',function(req,res,next){
  let userId = req.query.userId
  db.dbConnect('select * from user where userId = ?',[userId],function(err,data){
    console.log(data)
    res.send(data[0])
  })
})
router.get('/getReleaseData', function (req, res, next) {
  db.dbConnect('SELECT user.userId,nickname,picture,place,time,otherRemarks,contactMethod,releaseType,urgent FROM USER INNER JOIN releaseinfo ON user.userId = releaseinfo.userId', [], function (err, data) {
    db.dbConnect('SELECT * FROM picture', [], function (err1, data1) {
      (data || []).map(item => {
        item.img = []
        data1.forEach(it => {
          if (item.userId == it.userId && it.time == item.time) {
             item.img.push(it)
          }
          
        })
        return item
      })
      res.send(data)
    })
  })
})

router.post('/upload', function (req, res, next) {
  let { userId, time, otherRemarks, place, contactMethod, fileList, releaseType, urgent } = req.body;
  if (userId) {
    releaseType = releaseType == "失物" ? 1 : 2
    const sqlarr = [userId, place, time, otherRemarks, contactMethod, releaseType, urgent]
    const sql = 'insert into releaseinfo (userId,  place, time, otherRemarks, contactMethod, releaseType,urgent) values(?,?,?,?,?,?,?)';
    db.dbConnect(sql, sqlarr, function (err, data) {
    })
    console.log(fileList)
    fileList.forEach(it => {
      let { uid, status, name, thumbUrl: url } = it;
      let arr = [userId, uid, status, name, url,time]
      let sqls = 'insert into picture (userId,uid,status,name,url,time) values(?,?,?,?,?,?)'
      db.dbConnect(sqls, arr, function (err, data) {
      })
    })
    res.send('success')
  } else {
    res.send("error")
  }
})

module.exports = router;