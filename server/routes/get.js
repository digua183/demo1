
var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var zhenzismsClient = require('../utils/zhenzisms');

var client = new zhenzismsClient('sms_developer.zhenzikj.com', '105645', '4c27d682-81e2-49de-a139-a287961a00f9');

router.get('/getverificationCode', function (req, res, nex) {
    let userId = req.query.userId
    let randnum = parseInt(Math.random() * 9000 + 1000)
    var params = { message: `验证码为: ${randnum}`, number: userId };
    console.log(params)
    var resa = client.send(params);
    resa.then(function (data) {
        res.send({ randnum })
    })
})
router.post('/registerNow', function (req, res, next) {
    let registerData = req.body
    let { userId, password, surePassword } = registerData
    let jurisdiction = 2
    let nickName = `用户${parseInt(Math.random() * 9000 + 1000)}`
    db.dbConnect('insert into user (userId,password,nickName,jurisdiction) values(?,?,?,?)', [userId, password, nickName, jurisdiction], function (err, data) {
        res.send(data)
    })

})
router.get('/deleteData', function (req, res, next) {
    let userId = req.query.userId
    let time = req.query.time
    new Promise(function (resolve, reject) {
        db.dbConnect('delete from picture where userId = ? and time = ?', [userId, time], function (err, data) {
            if (err) {
                reject('error')
            }
            resolve()
        })
    }).then(function () {
        db.dbConnect('delete from releaseinfo where userId = ? and time = ?', [userId, time], function (err, data) {
            if (!err) {
                res.send('success')
            }
        })
    })
})

router.get('/getPersonalReleaseInfo', function (req, res, next) {
    let userId = req.query.userId
    new Promise(function (resolve, reject) {
        db.dbConnect('SELECT user.userId,nickname,picture,type,place,time,otherRemarks,contactMethod,releaseType,urgent FROM USER INNER JOIN releaseinfo ON user.userId = releaseinfo.userId AND user.userId = ?', [userId], function (err, data) {
            resolve(data)
        })
    })
        .then(function (data) {
            db.dbConnect('select * from picture where userId = ?', [userId], function (err, data2) {
                data.map(item => {
                    item.img = []
                    data2.map(it => {
                        if (item.time == it.time) {
                            return item.img.push(it)
                        }
                    })
                })
                res.send(data)
            })
        })



})

module.exports = router; 