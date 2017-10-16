// pages/help/help.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsid:0,
    showTopTips:"",
    step:2,
    title: "",
    description: "",
    address: "",
    address_comment: "",
    lat:0,
    lng:0,
    photos: [],
    mobile: "",
    weixin: "",
    qq: "",
    othercontact: "",
  },
  changetitle(e){
    this.setData({ title: e.detail.value});
    if(this.data.tipsid==1){
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  backstep() {
    var step=this.data.step;
    if(step==1){
      wx.navigateBack();
    }else{
      this.setData({ step: --step});
    }
  },
  nextstep(){
    var step = this.data.step;
    if(step==1){
      if(this.data.title.trim()==""){
        this.setData({ tipsid:1, showTopTips: "标题不能为空" });
        return;
      }
    }
    this.setData({ step: ++step, showTopTips:"" });
  },
  findLocation(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.markerid);
    wx.getLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        app.qqmapsdk.reverseGeocoder({
              location: {
                    latitude: 39.984060,
                    longitude: 116.307520
              },
              success: function (res) {
                console.log(res);
                    var address="";
                    if (res.result.address_component.province == res.result.address_component.city){
                      address = res.result.address_component.province;
                    }else{
                      address = res.result.address_component.province + res.result.address_component.city;
                    }
                    address += res.result.formatted_addresses.recommend;
                    that.setData({ address: address, lat: res.result.location.lat, lng: res.result.location.lng});
              },
              fail: function (res) {
                    console.log(res);
              },
              complete: function (res) {
                    console.log(res);
              }
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