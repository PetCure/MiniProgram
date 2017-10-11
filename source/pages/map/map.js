// pages/map/map.js
var QQMapWX = require('../../libs/qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  mapCtx:null,
  /**
   * 页面的初始数据
   */
  data: {
    lat: 22.531585,
    lng: 114.055939,
    markers:[]
  },
  regionchange(e) {
    if(e.type=="end"){
    var that=this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({ lat: res.latitude, lng: res.longitude});
        //console.log(that.data.lat);
        //console.log(that.data.lng);
        //that.loadMarkersFromCenter();
        that.mapCtx.moveToLocation();
      }
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'IDVBZ-TSAKD-TXG43-H442I-74KVK-6LFF5'
    });
    var that=this;
    this.mapCtx = wx.createMapContext("map4select");
    wx.getLocation({
      success:function(res){
        //console.log(JSON.stringify(res));
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });
        that.mapCtx.moveToLocation();
        that.loadMarkersFromCenter();
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
  
  },
  setMarker(marker){
    this.data.markers.push(marker);
  },
  loadMarkersFromCenter(){
    this.loadMarkers(this.data.lat,this.data.lng);
  },
  loadMarkers(center_lat,center_lng){
    var markers = [];
    for (var i = 0; i < 15; i++) {
      var lat = (((Math.random() * 50) % 2 > 1 ? 1 : -1) * Math.random() / 1000).toFixed(6);
      var lng = (((Math.random() * 50) % 2 > 1 ? 1 : -1) * Math.random() / 1000).toFixed(6);
      //lat=0;
      //lng=0;
      var marker = {
        id: "mk_" + i,
        latitude: Number(center_lat) + Number(lat),
        longitude: Number(center_lng) + Number(lng),
        width: 40,
        height: 40,
        iconPath: "/images/icon/sos.png"
      }
      //console.log(JSON.stringify(marker));
      markers.push(marker);
    }

    this.setData({
      markers: markers
    });
  }
})