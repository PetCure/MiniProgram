// pages/latest/latest.js
var HelpApi = require('../../apis/help.js');
var helpApi = new HelpApi();
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    helps:[],
    nomoredata:false
  },
  gotoHelp(e){
      var id=e.currentTarget.id.split("_")[1];
      console.log(id);
      wx.navigateTo({
        url: '../help/help?markerid=' + id
      });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadHelps();
  },
  loadHelps(){
    var that=this;
    helpApi.latest({ }, function (data) {
      console.log(data);
      if(data.length>0){
        that.latestpulltime = data[0].published_date;
        that.latestreachtime = data[data.length-1].published_date;
        var helps = that.data.helps;
        for(var i=0;i<data.length;i++){
          data[i].photo = app.apiconfig.UploadFolderUrl + "/help/" + data[i].photo;
          helps.push(data[i]);
        }
        that.setData({helps:helps});
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
  latestpulltime:"",
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    var that = this;
    helpApi.latest({ "new": this.latestpulltime}, function (data) {
      console.log(data);
      if (data.length > 0) {
        that.latestpulltime = data[0].published_date;
        for (var i = 0; i < data.length; i++) {
          data[i].photo = app.apiconfig.UploadFolderUrl + "/help/" + data[i].photo;
        }
        var helps = that.data.helps;
        var family = data.concat(helps);
        that.setData({ helps: family });
      }
    });
  },

  latestreachtime: "",
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nomoredata==true){
      return;
    }
    var that = this;
    helpApi.latest({ latest: this.latestreachtime}, function (data) {
      console.log(data);
      if (data.length > 0) {
        that.latestreachtime = data[data.length - 1].published_date;
        var helps = that.data.helps;
        for (var i = 0; i < data.length; i++) {
          data[i].photo = app.apiconfig.UploadFolderUrl + "/help/" + data[i].photo;
          helps.push(data[i]);
        }
        that.setData({ helps: helps });
      }else{
        that.setData({nomoredata:true});
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})