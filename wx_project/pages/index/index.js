// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";
import { myrequest } from "../../request/myRequest.js";

Page({
   goOtherPage(e) {
    let query = e.currentTarget.dataset['index'];
    wx.redirectTo({
      url: `/pages/category/index?id=${query}`
    });
  },
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航 数组
    catesList:[
      {id:0,name:'图书',image_src:'http://img63.ddimg.cn/upload_img/00528/0000/tushu-1561292724.jpg'},
      {id:1,name:'童书',image_src:'http://img61.ddimg.cn/upload_img/00528/0000/tongshu-1561292724.jpg'},
      {id:2,name:'小说',image_src:'http://img60.ddimg.cn/upload_img/00528/0000/14-xiaoshuo-1585653062.png'},
      {id:3,name:'文学',image_src:'http://img61.ddimg.cn/upload_img/00528/0000/16-wenxue-1585653062.png'}
    ],
    // 楼层数据
    floorList:[
    ],
    floor_title:[
      {name:"为您精选",image_src:"http://img63.ddimg.cn/upload_img/00762/1/00-1553684122.jpg",
      children:[]},
      {name:"新书上架",image_src:"http://img63.ddimg.cn/upload_img/00478/0609/720x100-xssj-0925.png",children:[]},
      {name:"主编推荐",image_src:"http://img62.ddimg.cn/upload_img/00478/0609/720x100-zbtj-0925.png",children:[]},
    ],
    myarr1:[],
    myarr2:[],
    myarr3:[],
    listArr:[]
  },
  // 页面开始加载 就会触发
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    wx.request({
      url: 'http://127.0.0.1:3001/swiper',
      success: (result) => {
        this.setData({
          swiperList: result.data
        })
      }
    });

    
    // this.getSwiperList();
    this.getFloorList();
      
  },

  // 获取轮播图数据
  getSwiperList(){
    request({ url: "/home/swiperdata" })
    .then(result => {
      console.log(result);
      
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取 分类导航数据
  getCateList(){
    request({ url: "/home/catitems" })
    .then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  //跳转页面


  // 获取 楼层数据
  getFloorList(){
    wx.request({
      url: 'http://127.0.0.1:3001/booklist',
      success: (result) => {
        let obj = result.data
        console.log(obj);
        
        let arr1 = []
        let arr2 = []
        let arr3 = []
        arr1 = obj.filter((item,index)=>{
         return  index >= 0 && index<6
        })
        arr2 = obj.filter((item,index)=>{
          return index >= 6 && index<12
        })
        arr3 = obj.filter((item,index)=>{
          return index >= 12 && index<18
        })

        let testarr = []
        testarr.push(arr1,arr2,arr3)
        console.log(testarr);

        this.setData({
          listArr:testarr
        })
      }
    });
    
  },

})
