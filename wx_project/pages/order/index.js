/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */

import { request } from "../../request/index.js";
import { myrequest } from "../../request/myRequest.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "待发货",
        isActive: true
      },
      {
        id: 1,
        value: "全部",
        isActive: false
      }
    ]
  },

  onLoad(option){
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    // 4 激活选中页面标题 当 type=1 index=0 
    this.changeTitleByIndex(option.id);
      

    if(option.id){
      console.log("options"+option.id);
      this.getOrders(option.id);
    }else{
      console.log("type"+type);
      this.changeTitleByIndex(type);
      this.getOrders(type);
    }
  },

  onShow(options) {

 
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await myrequest( "/getorder","get");
    console.log(res);
    if(type == 0){
      let order = res.data.filter(v => v.statement == 0)
      if(order.length == 0){
        const obj = {
          b_title:"暂时没有数据"
        }
        this.setData({
          orders: order
        })
      }
      this.setData({
        orders: order
      })
    }
    else if(type == 1){
      let order = res.data.filter(v => v.statement == 1)
      if(order.length == 0){
        const obj = {
          b_title:"暂时没有数据"
        }
        this.setData({
          orders: obj
        })
      }
      this.setData({
        orders: order
      })
    }

  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    console.log(index+"index");
    
    let { tabs } = this.data;
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // console.log(index);
    
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index);
  },
  async handleSure(e){
    let query = e.currentTarget.dataset['index'];
    const key  = {
      id:query
    }
    const res = await myrequest( "/confirmReceipt","post",key);
    // console.log(res);
    if(res.data){
      this.getOrders(0)
    }
  },
  async handleDelete(e){
    let query = e.currentTarget.dataset['index'];
    const key  = {
      id:query
    }
    const res = await myrequest( "/deleteorder","post",key);
    let _this = this
    if(res.data.msg == "添加成功"){
      this.getOrders(1)
    }
  }
})