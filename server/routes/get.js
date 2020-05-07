var express = require('express');
var router = express.Router();
var db = require('../utils/db.js');


router.get('/deleteData',function(req,res,next){
    let userId = req.query.userId
    let time = req.query.time
    new Promise(function(resolve,reject){
        db.dbConnect('delete from picture where userId = ? and time = ?',[userId,time],function(err,data){
            if(err){
                reject('error')
            }
            resolve()
        })
    }).then(function(){
        db.dbConnect('delete from releaseinfo where userId = ? and time = ?',[userId,time],function(err,data){
           if(!err){
               res.send('success')
           }
        })
    })
    
    
})

router.get('/getPersonalReleaseInfo', function (req, res, next) {
    let userId = req.query.userId
    console.log(req.query)
    console.log(userId,'aaaa')
    new Promise(function(resolve,reject){
        db.dbConnect('SELECT user.userId,nickname,picture,type,place,time,otherRemarks,contactMethod,releaseType,urgent FROM USER INNER JOIN releaseinfo ON user.userId = releaseinfo.userId AND user.userId = ?', [userId], function (err, data) {
            resolve(data)
        })
    })
    .then(function(data){
        db.dbConnect('select * from picture where userId = ?',[userId],function(err,data2){
         data.map(item=>{
             item.img = []
             data2.map(it=>{
                 if(item.time == it.time){
                     return item.img.push(it)
                 }
             })
         })
         res.send(data)   
        })
    })

    

})

module.exports = router; 