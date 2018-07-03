// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({title:options.title});
    wx.hideShareMenu({
      
    })
  }
  backtopage(){
    wx.switchTab({
      url: '/pages/home/home',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
}
var content = new Content();
var body = content.generateBodyJson(); 
body.onLoad = content.onLoad;
body.backtopage = content.backtopage;
Page(body)