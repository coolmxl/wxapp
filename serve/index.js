let express = require('express')
let app = express()
let fs = require('fs')
let router = require('./router.js')
// const connection = require("./db")
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置art-template
app.engine('.html', require('express-art-template'))
app.set('view engine', '.html')

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  next()
})


// router(app)
// console.log(router)
// console.log(connection)

app.use(router)

app.listen(3001, () => {
  console.log("runing")
})
