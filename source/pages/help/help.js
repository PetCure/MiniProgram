// pages/help/help.js
var HelpApi = require('../../apis/help.js');
var helpApi = new HelpApi();
var HelpphotoApi = require('../../apis/helpphoto.js');
var helpphotoApi = new HelpphotoApi();
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
    uploadurl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.markerid);
    var markerid = options.markerid;
    var that=this;
    this.setData({ uploadurl: app.apiconfig.UploadFolderUrl});
    helpApi.get(markerid,function(data){
      console.log(data);
      that.setData({
        marker_id: markerid,
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
      });
    });
    helpphotoApi.list({help_id:markerid},function(data){
      var photos=[];
      for(var i=0;i<data.length;i++){
        photos.push(app.apiconfig.UploadFolderUrl+"/help/"+data[i].photo);
      }
      that.setData({ photos: photos});
    });
  }, 
  previewImage: function (e) {
    var photos = this.data.photos;
    
    wx.previewImage({
      urls: photos // 需要预览的图片http链接列表
    })
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