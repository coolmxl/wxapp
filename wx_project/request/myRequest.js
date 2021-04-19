
// 同时发送异步代码的次数
let ajaxTimes=0;
export const myrequest=(myurl,method,mydata)=>{
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  // 定义公共的url
  const baseUrl="http://127.0.0.1:3001";
  return new Promise((resolve,reject)=>{
    wx.request({
     url:baseUrl+myurl,
     method:method,
     data:mydata,
     success:(result)=>{
       resolve(result);
     },
     fail:(err)=>{
       reject(err);
     },
     complete:()=>{
      ajaxTimes--;
      if(ajaxTimes===0){
        //  关闭正在等待的图标
        wx.hideLoading();
      }
     }
    });
  })
}