var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('./mime');
const connection = require("./db")

//服务器端口号
var port = 8888;
//服务器路径
var root = './public';
//默认访问根目录下的"index.html"
var index = 'index.html';

http.createServer(function (request, response) {

  var realPath = url.parse(request.url).pathname;

  //默认访问根目录下的index.html
  if (realPath.charAt(realPath.length - 1) == "/") {
    realPath += index;
  }

  //安全问题，禁止父路径
  realPath = realPath.replace(/\.\./g, '');
  var realPath = root + realPath;

  //获取文件的后缀名，为待会的MIME类型提供支持
  var ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknown';

  console.log(realPath);
  // if()


  //先判断访问文件是否存在，并返回对应的HTTP状态码，再读取静态文件
  fs.exists(realPath, function (exists) {
    console.log('path.exists--%s', exists);
    if (!exists) {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });

      response.write("This request URL " + realPath + " was not found on this server.");
      response.end();
    } else {
      fs.readFile(realPath, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, {
            'Content-Type': 'text/plain'
          });

          response.end(err + '');
        } else {
          //MIME类型支持
          var contentType = mime[ext] || "text/plain";
          response.writeHead(200, {
            'Content-Type': contentType
          });

          response.write(file, "binary");
          response.end();
        }
      });
    }
  });

}).listen(port);

// 终端打印运行信息
console.log('Server running at port:' + port);