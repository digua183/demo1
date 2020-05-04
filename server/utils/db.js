var mysql = require('mysql')

module.exports = {
    config: {
        host: 'localhost',
        port: 3306,
        user: 'root123',
        password:'root123',
        database: 'graduationset',
        dateStrings:true
    },
    dbConnect:function (sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection(function (err, connect) {
            if (err) {
                return err;
            }
            connect.query(sql, sqlArr, callBack)
            connect.release()
        })
    }
}