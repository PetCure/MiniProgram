// pages/help/help.js
var HelpApi = require('../../apis/help.js');
var helpApi = new HelpApi();
var HelpphotoApi = require('../../apis/helpphoto.js');
var helpphotoApi = new HelpphotoApi();
var HelpupApi = require('../../apis/helpup.js');
var helpupApi=new HelpupApi();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    marker_id:0,
    title: "",
    description: "",
    published_date: "",
    address: "",
    address_comment: "",
    photos: [],
    display: "",
    mobile: "",
    weixin: "",
    qq: "",
    othercontact: "",
    uploadurl:"",
    upcount:"",
    upmember:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options.markerid);
    var markerid = options.markerid;
    var that=this;
    this.setData({ marker_id: markerid, uploadurl: app.apiconfig.UploadFolderUrl});
    helpApi.get(markerid,function(data){
      console.log(data);
      that.setData({
        marker_id: data.id,
        title: data.title,
        description: data.description,
        published_date: data.published_date,
        address: data.address,
        address_comment: data.address_comment,
        display: "Y",
        mobile: data.mobile,
        weixin: data.weixin,
        qq: data.qq,
        othercontact: data.othercontact,
        upcount: (data.upcount!=null&&data.upcount>0?"("+data.upcount+")":""),
      });
    });
    helpphotoApi.list({help_id:markerid},function(data){
      var photos=[];
      for(var i=0;i<data.length;i++){
        photos.push(app.apiconfig.UploadFolderUrl+"/help/"+data[i].photo);
      }
      that.setData({ photos: photos});
    }); 
    this.loadUpall();
  }, 
  loadUpall() {
    var that = this;
    console.log(that.data.marker_id);
    helpApi.allup({ help_id: that.data.marker_id }, function (data) {
      console.log(data);
      that.setData({ upmember: data });
    });
  },
  previewImage: function (e) {
    var photos = this.data.photos;
    
    wx.previewImage({
      urls: photos // 需要预览的图片http链接列表
    })
  },
  tapUpHelp(){
    if (app.globalData.userInfo.openid == undefined) {
      wx.navigateTo({
        url: '../index/index'
      });
      return;
    }
    this.uphelp();
  },
  navigatecallback(){
    if (app.globalData.userInfo.openid == undefined){
      return;
    }else{
      this.uphelp();
    }
  },
  uphelp(){
    console.log(app.globalData.userInfo);
    var json = { openid: app.globalData.userInfo.openid,
      help_id: this.data.marker_id
    };
    json.nickName = app.globalData.userInfo.nickName;
    json.avatarUrl = app.globalData.userInfo.avatarUrl;
    json.gender = app.globalData.userInfo.gender;
    json.province = app.globalData.userInfo.province;
    json.city = app.globalData.userInfo.city;
    json.country = app.globalData.userInfo.country;

    var that=this;
    helpupApi.update(json,function(data){
      console.log(data);
        if(data.code==-302){
          wx.showToast({
            title: '1个小时内只能点赞一次',
          });
        }
        if(data.code==0){
          that.setData({ upcount: (data.return != null && data.return > 0 ? "(" + data.return + ")" : "")});
          that.loadUpall();
        }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})