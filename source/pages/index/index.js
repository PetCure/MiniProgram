//index.js
//获取应用实例
var WechatApi=require('../../apis/wechat.js');
var wechatApi=new WechatApi();
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    var that=this;
    if (e.detail.errMsg !="getUserInfo:fail auth deny"){
      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            //发起网络请求
            wechatApi.decryptuserinfo({ code: res.code, 
                                        encryptedData: e.detail.encryptedData,
                                        iv:e.detail.iv},function(data){
            var data=JSON.parse(data);
            var userInfo=e.detail.userInfo;
            userInfo.openid = data.openid;
            console.log(data);
            app.globalData.userInfo = userInfo;
            console.log(app.globalData.userInfo);
              that.setData({
                 userInfo: userInfo,
                 hasUserInfo: true
                });
              var pages = getCurrentPages();
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                if(prePage.navigatecallback!=undefined)
                prePage.navigatecallback();
              }
              wx.navigateBack({
                
              });
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            wx.showToast({
              title: '获取用户信息失败',
            })
          }
        }
      });



      
    }
  },
  login:function(){
    
  }
})
