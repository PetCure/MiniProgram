// pages/searchlocation/searchlocation.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    items:[],
    lat:0,
    lng:0
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      items: []
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      items: []
    });
  },
  inputTyping: function (e) {
    var that=this;
    this.setData({
      inputVal: e.detail.value
    });
    app.qqmapsdk.search({
      keyword: e.detail.value,
      address_format:"short",
      location: {
        latitude: this.data.lat,
        longitude: this.data.lng},
      success: function (res) {
        console.log(res.data);
        that.setData({
          items: res.data
        });
      },
      fail: function (res) {
        console.log(res.status, res.message);
      },
      complete: function (res) {
        console.log(res.status, res.message);
      }
    });
  },
  addresstap(e){
    var id=e.currentTarget.id;
    var items=this.data.items;
    for(var i=0;i<items.length;i++){
      if(id==items[i].id){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];  //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          address: items[i].address,
          lat: items[i].latitude,
          lng: items[i].longitude, 
          tipsid: 0, showTopTips: ""
        });
        wx.navigateBack();
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getLocation({
      "type": "gcj02",
      success: function (res) {
        console.log(res);
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });     
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