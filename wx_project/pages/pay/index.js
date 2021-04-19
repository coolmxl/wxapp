
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import { myrequest } from "../../request/myRequest.js";

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    buyNow:[],
    buyNowPrice:0
  },
  onLoad(option){
    if(option){
      let data = JSON.parse(option.name)
      const address = wx.getStorageSync("address");
      console.log(address);
      let mlxarr = []
      mlxarr.push(data.img)
      console.log("====");
      console.log(mlxarr);
      
      
      const consignee_addr = this.data.address.all;
      this.setData({ address });
      let allP = data.price*data.num
      const orderParams = { 
        allPrice:allP, 
        name:data.name,
        img:mlxarr,
        price:data.price,
        num:1
      };
      let arr = []
      arr.push(orderParams)
      this.setData({
        buyNow:arr,
        buyNowPrice:allP, 
      })
      if(this.data.buyNow[0].img){
        console.log(520);
      console.log(this.data.totalPrice);

      }
      
    }
  },
  onShow(option) {
          // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.b_price;
      totalNum += v.num;
    })
    totalPrice = totalPrice.toFixed(2)
    this.setData({
      cart,
      totalPrice, 
      totalNum,
      address
    });
  },
  // 点击 支付 
  async handleOrderPay() {
    try {

      // 1 判断缓存中有没有token 
      const token = wx.getStorageSync("token");
      // 2 判断
      // if (!token) {
      //   wx.navigateTo({
      //     url: '/pages/auth/index'
      //   });
      //   return;
      // }
      // 3 创建订单
      // 3.1 准备 请求头参数
      // const header = { Authorization: token };
      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.b_id,
        goods_number: v.num,
        goods_price: v.b_price
      }))

      const orderParams = { 
        allPrice:order_price, 
        address:consignee_addr,
        goods,
        cart
      };
      const myData = JSON.stringify(orderParams)
      console.log(myData);
      if(this.data.buyNow.length !== 0){
        const data = {
          buyNow:this.data.buyNow,
          address:consignee_addr
        }
        let msg = await myrequest('/paynow',"post",data)
        if(msg.data.msg == "添加成功"){
          wx.redirectTo({
            url: '/pages/order/index?id=0 '
          });
        }                
      }
      else{
        let msg = myrequest('/pay',"post",myData)
        if(msg){
          let newCart=wx.getStorageSync("cart");
          newCart=newCart.filter(v=>!v.checked);
          wx.setStorageSync("cart", newCart);
          wx.redirectTo({
            url: '/pages/order/index?id=0 '
          });
        }
      }

    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }


})



