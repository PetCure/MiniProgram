// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { PostApi } from "../../apis/post.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    super.onLoad(options);
    this.Base.setMyData({
      currenttab: "0"
    });
  }
  onMyShow() {
    var that = this;
    that.loaddata();
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
    this.loaddata();
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
    this.loaddata();
  }
  loaddata(e) {
    var api = new PostApi();
    var that = this;
    var seq = this.Base.getMyData().currenttab;
    switch(seq){
      case "0": 
        api.list({ orderby: " r_main.post_time desc ", status: "A", "onlymy": "Y"},(listA)=>{
          for (var i = 0; i < listA.length; i++) {
            listA[i].cover = listA[i].images.split(",")[0];
          }
          that.Base.setMyData({ listA});
        });
        break;
      case "1":
        api.list({ orderby: " r_main.post_time desc ", status: "I", "onlymy": "Y" }, (listI) => {
          for (var i = 0; i < listI.length; i++) {
            listI[i].cover = listI[i].images.split(",")[0];
          }
          that.Base.setMyData({ listI });
        });
        break;
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;
Page(body)