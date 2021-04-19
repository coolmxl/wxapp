
var mysql = require('mysql');     //引入mysql模块

var connection = mysql.createConnection({      //创建mysql实例
  host: '127.0.0.1',
  port: '',
  user: 'root',
  password: '123456',
  database: 'book'
});
connection.connect();

module.exports = connection
