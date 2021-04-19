const express = require("express")
const connection = require("./db")
var router = express.Router()

router.get('/', (req, res) => {
  res.send("INDEX PAGE")
})
const getNowTime = () => {
  let nowTime = ""
  const date = new Date
  const year = date.getFullYear()
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  // let hours = date.getHours().toString().padStart(2,'0')  或者可以这样
  const mins = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  const secondes = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  nowTime = `${year}-${hours}:${mins}:${secondes}`
  return nowTime
}


function getDbData (table, limit) {
  var sql = `SELECT * FROM ${table}  LIMIT 0,20`;
  if (limit) {
    var sql = `SELECT * FROM ${table} `;
  }
  return new Promise((reslove, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR]:', err.message);
      }
      reslove(result)
      // res.send(result)
    });
  })
}

router.get('/alllist', (req, res) => {
  getDbData('book', true).then(callbackRes => {
    callbackRes.map(item => {
      item.b_bookimg = eval(item.b_bookimg)
      item.b_price = item.b_price.substr(1)
    })
    res.send(callbackRes)
  })
})

router.get('/booklist', (req, res) => {
  var sql = 'SELECT * FROM book LIMIT 0,20';
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR]:', err.message);
    }
    result.map(item => {
      item.b_bookimg = eval(item.b_bookimg)
      item.b_price = item.b_price.substr(1)
    })
    res.send(result)
  });
})
router.post('/book_add', (req, res) => {
  console.log(req.body)  // 直接通过req对象中的body属性就可以得到请求数据
  let addSql = 'INSERT INTO book(b_title,b_author,b_press,b_price,b_bookimg) VALUES(?,?,?,?,?)';
  let addSqlParams = ['你不知道JavaScript', '反正不是毛鑫林', '清华出版社', '26', 'http://i0.hdslb.com/bfs/archive/5ba59f61127a6a57b28cb72f8d6ca611bfe44e40.jpg@412w_232h_1c.jpg'];
  // let addSqlParams = [req.body.title, req.body.author, req.body.press, req.body.price, req.body.bookimg];

  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[增加失败] - ', err.message);
      return;
    }
    console.log('--------------INSERT-------------');
    console.log('增加成功 ID:', result.insertId);
    console.log('增加成功:', result);
    console.log('--------------------------------\n\n');
    res.send({
      msg: '添加成功'
    })
  });
})

router.post('/book_delete', (req, res) => {
  console.log(req.body)  // 直接通过req对象中的body属性就可以得到请求数据
  let delSql = `DELETE FROM users where id=${req.body.id}`;
  // let delSql = `DELETE FROM users where id=${req.body.id}`;

  connection.query(delSql, (err, result) => {
    if (err) {
      console.log('[删除失败] - ', err.message);
      return;
    }
    console.log('--------DELETE---------------');
    console.log('删除成功', result.affectedRows);
    console.log('------------------------\n\n');
    res.send({
      msg: '删除成功'
    })
  });
})


router.post('/book_update', (req, res) => {
  console.log(req.body)  // 直接通过req对象中的body属性就可以得到请求数据
  let modSql = 'UPDATE book SET b_price = ? WHERE id = ?';
  // let modSqlParams = [56, 22];
  let modSqlParams = [req.body.price, req.body.id];

  connection.query(modSql, modSqlParams, (err, result) => {
    if (err) {
      console.log('[更新失败] - ', err.message);
      return;
    }
    console.log('----------UPDATE---------------');
    console.log('更新成功', result.affectedRows);
    console.log('-------------------------------\n\n');
    getDbData('book').then(callbackRes => {
      res.send({
        msg: '更新成功',
        callbackRes
      })
    })

  });
})

router.get('/swiper', (req, res) => {
  var sql = 'SELECT * FROM swiper';
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR]:', err.message);
    }
    res.send(result)
  });
})

router.post('/pay', (req, res) => {
  console.log(req.body);
  console.log("=============req.body.myData=========");
  const data = req.body
  const imgs = JSON.stringify(data.cart[0].b_bookimg,)
  const now = getNowTime()
  let addSql = `
  INSERT INTO pay_order(order_time,all_price,count,address,statement,b_title,b_author,b_press,b_price,b_bookimg,b_content,b_time,b_tag) VALUES(
    ?,?,?,?,?,?,?,?,?,?,?,?,?
  )
  `;
  // let addSqlParams = ['你不知道JavaScript', '反正不是毛鑫林', '清华出版社', '26', 'http://i0.hdslb.com/bfs/archive/5ba59f61127a6a57b28cb72f8d6ca611bfe44e40.jpg@412w_232h_1c.jpg'];
  let addSqlParams = [now, data.allPrice, data.goods[0].goods_number, data.address, 0,
    data.cart[0].b_title, data.cart[0].b_author,
    data.cart[0].b_press, data.cart[0].b_price, imgs,
    data.cart[0].b_content, data.cart[0].b_time, data.cart[0].b_tag];
  console.log(addSqlParams);
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[增加失败] - ', err.message);
      return;
    }
    console.log('--------------INSERT-------------');
    console.log('增加成功 ID:', result.insertId);
    console.log('增加成功:', result);
    console.log('--------------------------------\n\n');
    res.send({
      msg: '添加成功'
    })
  });
})

router.post('/paynow', (req, res) => {
  console.log(req.body);
  const data = req.body.buyNow
  const address = req.body.address
  const now = getNowTime()
  let arr = [data[0].img]

  let addSql = `
  INSERT INTO pay_order(order_time,all_price,count,address,statement,b_title,b_author,b_press,b_price,b_bookimg,b_content,b_time,b_tag) VALUES(
    ?,?,?,?,?,?,?,?,?,?,?,?,?
  )
  `;

  let addSqlParams = [now, data[0].allPrice, 1, address, 0, data[0].name, "author", "press", data[0].price, arr, "content", "56999", "tag"];
  console.log(addSqlParams);
  connection.query(addSql, addSqlParams, (err, result) => {
    if (err) {
      console.log('[增加失败] - ', err.message);
      return;
    }
    console.log('--------------INSERT-------------');
    console.log('增加成功 ID:', result.insertId);
    console.log('增加成功:', result);
    console.log('--------------------------------\n\n');
    res.send({
      msg: '添加成功'
    })
  });
})

router.get('/getOrder', (req, res) => {
  getDbData('pay_order').then(callbackRes => {
    callbackRes.map(item => {
      if (item.b_bookimg.length > 65) {
        item.b_bookimg = eval(item.b_bookimg)
      }
      else if (item.b_bookimg.length < 65) {
        let arr = []
        arr.push(item.b_bookimg)
        item.b_bookimg = arr
      }
    })
    res.send(
      callbackRes
    )
  })
})
router.post('/confirmReceipt', (req, res) => {
  let modSql = 'UPDATE pay_order SET statement = 1 WHERE b_id = ?';
  let modSqlParams = [req.body.id];
  connection.query(modSql, modSqlParams, (err, result) => {
    if (err) {
      console.log('[更新失败] - ', err.message);
      return;
    }
    console.log('----------UPDATE---------------');
    console.log('更新成功', result.affectedRows);
    console.log('-------------------------------\n\n');
    getDbData('pay_order').then(callbackRes => {
      res.send(
        callbackRes
      )
    })

  });
})

router.post('/deleteorder', (req, res) => {
  let id = req.body.id
  console.log(id);
  let delSql = `DELETE FROM pay_order where b_id=${id}`;
  // res.send({
  //   msg: '添加成功'
  // })
  connection.query(delSql, (err, result) => {
    if (err) {
      console.log('[删除失败] - ', err.message);
      return;
    }
    console.log('--------DELETE---------------');
    console.log('删除成功', result.affectedRows);
    console.log('------------------------\n\n');
    res.send({
      msg: '添加成功'
    })
  });
})

router.get('/tag', (req, res) => {
  getDbData('book', true).then(callbackRes => {
    const tags = []
    callbackRes.map(v => {
      v.b_bookimg = eval(v.b_bookimg)
      tags.push(v.b_tag)
    })
    const newtags = new Set(tags)
    const newqztags = [...newtags]
    let ntgas = newqztags.filter((v, index) => index < 4)
    const obj = []
    ntgas.map(v => {
      let myobj = {
        name: v
      }
      obj.push(myobj)
    })
    res.send({
      obj
    }
    )
  })
})

router.get('/tags', (req, res) => {
  getDbData('book', true).then(callbackRes => {
    const tags = []
    callbackRes.map(v => {
      v.b_bookimg = eval(v.b_bookimg)
      tags.push(v.b_tag)
    })
    const newtags = new Set(tags)
    const newqztags = [...newtags]
    res.send({
      newqztags,
    })
  })
})

router.post('/detail', (req, res) => {
  let id = req.body.id
  var sql = `SELECT * FROM book where b_id = ${id} `;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR]:', err.message);
    }
    result.map(item => {
      item.b_bookimg = eval(item.b_bookimg)
      item.b_price = item.b_price.substr(1)
    })
    res.send(result)
  });
})

router.post('/search', (req, res) => {
  var sql = `SELECT * FROM book where b_title like ? or b_author like ?`;
  let modSqlParams = ['%' + req.body.key + '%', '%' + req.body.key + '%'];
  connection.query(sql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR]:', err.message);
    }
    result.map(item => {
      item.b_bookimg = eval(item.b_bookimg)
      item.b_price = item.b_price.substr(1)
    })
    res.send(result)
  });
})

module.exports = router


