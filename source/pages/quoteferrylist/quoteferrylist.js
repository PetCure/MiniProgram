// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({currenttab:"0"});
  }
  onMyShow() {
    var that = this;
    this.loaddata();
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
  loaddata(){
    var currenttab = this.Base.getMyData().currenttab;
    console.log("miaomiaomiao"+currenttab);
    var api = new QuoteferryApi();
    switch(currenttab){
      case "0":
        console.log("miaomiaomiao");
        api.list({status:"1"},(list1)=>{
          this.Base.setMyData({list1});
        });
        break;
      case "1":
        api.list({ status: "2","orderby":"quote_time desc" }, (list2) => {
          this.Base.setMyData({ list2 });
        });
        break;
      case "2":
        api.list({ status: "3", "orderby": "abandon_time desc"  }, (list3) => {
          this.Base.setMyData({ list3 });
        });
        break;
      case "3":
        api.list({ status: "4", "orderby": "confirm_time desc"  }, (list4) => {
          this.Base.setMyData({ list4 });
        });
        break;
      case "4":
        api.list({  }, (listall) => {
          this.Base.setMyData({ listall });
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