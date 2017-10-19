// pages/help/help.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsid:0,
    showTopTips:"",
    step:1,
    title: "",
    description: "",
    address: "",
    lat: 0,
    lng: 0,
    address_comment: "",
    photos: [],
    mobile: "",
    weixin: "",
    qq: "",
    othercontact: "",
    UploadFolderUrl:""
  },
  changetitle(e){
    this.setData({ title: e.detail.value});
    if(this.data.tipsid==1){
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  changedescription(e) {
    this.setData({ description: e.detail.value });
  },
  tapaddress_comment(e){
    this.setData({ address_comment: e.detail.value });
    if (this.data.tipsid == 3) {
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  changemobile(e) {
    this.setData({ mobile: e.detail.value });
    if (this.data.tipsid == 5) {
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  changeweixin(e) {
    this.setData({ weixin: e.detail.value });
    if (this.data.tipsid == 5) {
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  changeqq(e) {
    this.setData({ qq: e.detail.value });
    if (this.data.tipsid == 5) {
      this.setData({ tipsid: 0, showTopTips: "" });
    }
  },
  changeothercontact(e) {
    this.setData({ othercontact: e.detail.value });
    if (this.data.tipsid == 5) {
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
    }else if(step==2){

      if (this.data.address.trim() == "") {
        this.setData({ tipsid: 2, showTopTips: "地址不能为空" });
        return;
      }

      if (this.data.address_comment.trim() == "") {
        this.setData({ tipsid: 3, showTopTips: "位置补充描述不能为空" });
        return;
      }
    } else if (step == 3) {

      if (this.data.photos.length<=0) {
        this.setData({ tipsid: 4, showTopTips: "至少上传一张图片" });
        return;
      }
    } else if (step == 4) {

      if (this.data.mobile.trim()==""
        && this.data.weixin.trim() == ""
        && this.data.qq.trim() == ""
        && this.data.othercontact.trim() == "") {
        this.setData({ tipsid: 5, showTopTips: "至少填写一种联系方式" });
        return;
      }else{
        //提交创建
        var HelpApi=require('../../apis/help.js');
        var helpApi=new HelpApi();
        helpApi.update(this.data,function(res){
          console.log(res);
          if(res.code==0){
            wx.navigateBack();
          }else{
            wx.showToast({
              title: res.return,
            })
          }
        });
        return;
      }
    }
    this.setData({ step: ++step, showTopTips:"" });
  },
  tapaddress(){
    wx.navigateTo({
      url: '../searchlocation/searchlocation'
    })
  },
  chooseImage: function (e) {
    var that = this;
    
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        //that.setData({
        //  photos: that.data.photos.concat(res.tempFilePaths)
        //});
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.apiconfig.FileUploadUrl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'module': 'help',
            "field":"file"
          },
          success: function (res) {
            console.log(res);
            var data = res.data
            if(data.substr(0,7)=="success"){
              data=data.split("|");
              var photo=data[2];
              var photos=that.data.photos;
              photos.push(photo);
              that.setData({photos:photos});
              that.setData({ tipsid: 0, showTopTips: "" });
            }else{
              wx.showToast({
                title: '上传失败，请重试',
                icon: 'warn',
                duration: 2000
              })
            }
            //do something
          }
        });
      }
    })
  },
  deleteImage:function(e){
      var photos=this.data.photos;
      var newphotos=[];
      for(var i=0;i<photos.length;i++){
        if (e.currentTarget.id!="photo_"+photos[i]){
          newphotos.push(photos[i]);
        }
      }
      this.setData({ photos: newphotos });
  },
  previewImage: function (e) {
    var photos = this.data.photos;
    var newphotos = [];
    for (var i = 0; i < photos.length; i++) {
      newphotos.push(app.apiconfig.UploadFolderUrl + photos[i]);
    }
    console.log(newphotos);
    wx.previewImage({
      urls: newphotos // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options.markerid);
    console.log(app.apiconfig.UploadFolderUrl);
    this.setData({ UploadFolderUrl: app.apiconfig.UploadFolderUrl});
    wx.getLocation({
      success:function(res){
        console.log(JSON.stringify(res));
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });  
        app.qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
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