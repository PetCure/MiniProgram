// pages/map/map.js

Page({
  mapCtx:null,
  /**
   * 页面的初始数据
   */
  data: {
    mylat: 22.531585,
    mylng: 114.055939,
    lat: 22.531585,
    lng: 114.055939,
    scale:19,
    markers:[],
    controls: [{
      id: "add_help",
      iconPath: '/images/icon/add.png',
      position: {
        left: 10,
        top: 10,
        width: 50,
        height: 50
      },
      clickable: true
    }, {
        id: "refresh_help",
      iconPath: '/images/icon/refresh.png',
      position: {
        left: 10,
        top: 70,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  controltap(e) {
    if (e.controlId=="add_help"){
      wx.navigateTo({
        url: '../helpcreate/helpcreate'
      });
    }
    if (e.controlId == "refresh_help") {
      //todo
    }
  },
  latestMarkerId:"",
  markertap(e){
    //console.log(this.latestMarkerId +"=="+ e.markerId);
    if(this.latestMarkerId==e.markerId){
      this.latestMarkerId="";
      this.gotoHelpDetail(e.markerId);
    }else{
      this.latestMarkerId=e.markerId;
    }
    //console.log(this.latestMarkerId + "==" + e.markerId);
  },
  callouttap(e){
    console.log(e);
    this.latestMarkerId = "";
    this.gotoHelpDetail(e.markerId);
  },
  maptap(e){
    this.setData({ log: JSON.stringify(e) });
  },
  regionchange(e) {
    if (e.type == "end") {
    //this.setData({log:e.timeStamp});
    var that = this;
      //console.log(JSON.stringify(e));
      //console.log(this.mapCtx);
    this.mapCtx.getScale({success:function(res){
      that.setData({ scale:res.scale});
    }});
    this.mapCtx.getCenterLocation({
      success: function (res) {
        //console.log(JSON.stringify(res));
        that.setData({ lat: res.latitude, lng: res.longitude});
        //console.log(that.data.lat);
        //console.log(that.data.lng);
        that.loadMarkersFromCenter();
        //that.mapCtx.moveToLocation();
      }
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({log:JSON.stringify(res)});
        console.log(res);
      }
    });
    this.mapCtx = wx.createMapContext("map4select");
    wx.getLocation({
      success:function(res){
        //console.log(JSON.stringify(res));
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });
        //that.setData({
        //  mylat: res.latitude,
        //  mylng: res.longitude
        //});
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
  markerid:0,
  loadMarkers(center_lat,center_lng){
    //this.removeMarkers();

    var markers=[];
    var count = (Math.random()*10);
    for (var i = 0; i < count; i++) {
      var lat = (((Math.random() * 50) % 2 > 1 ? 1 : -1) * Math.random() / 1000).toFixed(6);
      var lng = (((Math.random() * 50) % 2 > 1 ? 1 : -1) * Math.random() / 1000).toFixed(6);
      //lat=0;
      //lng=0;
      var marker = {
        id: "mk_" + this.markerid++,
        latitude: Number(center_lat) + Number(lat),
        longitude: Number(center_lng) + Number(lng),
        width:25,
        height: 25,
        iconPath: "/images/icon/sos.png",
        title:"title"+this.markerid.toString(),
        callout:{
          content: "有一只小狗受伤了，赶紧来帮忙",
          borderRadius:20,
          padding:5
        }
      }
      //console.log(JSON.stringify(marker));
      markers.push(marker);
    }

    this.setData({
      markers: markers
    });
    //this.resizeMarkers();
  },
  removeMarkers(){
    var markers = this.data.markers;
    var spc="";
    this.setData({ log: markers.length});
    for(var i=0;i<markers.length;i++){
      spc += markers[i].id;
      this.mapCtx.translateMarker({
        markerId: markers[i].id,
        destination: {
          latitude: 0,
          longitude: 0,
        },
        duration:1
      });
    }
    this.setData({ log: spc });
  
    //this.setData({markers:[]});
  },
  resizeMarkers(){
    var scale=19-this.data.scale;
    if(scale<0){
      scale=0;
    }
    var markers=this.data.markers;
    console.log(markers.length);
    var size=36-scale*4;
    if(size<1){
      size=1;
    }
    //var size=10;
    this.setData({log:size});
    for(var i=0;i<markers.length;i++){
      markers[i].width=size;
      markers[i].height=size;
    }
    this.setData({
      markers: markers
    });
  },
  gotoHelpDetail(markerId){
    console.log(markerId);
    wx.navigateTo({
      url: '../help/help?markerid='+markerId
    });
  }
})