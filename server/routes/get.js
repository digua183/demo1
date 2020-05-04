var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');


router.get('/getPersonalReleaseInfo', function (req, res, next) {
    let userId = req.query.userId
    console.log(req.query)
    console.log(userId,'aaaa')
    new Promise(function(resolve,reject){
        db.dbConnect('SELECT user.userId,nickname,picture,type,place,time,otherRemarks,contactMethod,releaseType,urgent FROM USER INNER JOIN releaseinfo ON user.userId = releaseinfo.userId AND user.userId = ?', [userId], function (err, data) {
            console.log(data)
            resolve(data)
        })
    })
    .then(function(data){
        data.map(it=>{
            it.img = []
            db.dbConnect('select * from picture where userId = ? and time = ? ',[it.userId,it.time],function(err,data2){
                it.img=data2
                return it;
            })
            
        })
        res.send(data)
    })

    

})

module.exports = router; 