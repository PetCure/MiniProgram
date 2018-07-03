// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  QuoteferryApi
} from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id = 4;
    super.onLoad(options);

    var now = new Date();//this.Base.util.FormatDateTime(new Date());
    var weekdayofnow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    var startdate = this.Base.util.FormatDate(now);
    var enddate = this.Base.util.FormatDate(weekdayofnow);

    this.Base.setMyData({
      currenttab: 3, startdate: startdate, enddate: enddate, orderdate: startdate, ordertime:""
    });
  }
  onMyShow() {
    var that = this;
    var id = this.Base.getMyData().id;
      var quoteferryapi = new QuoteferryApi();
      quoteferryapi.info({
        id: this.Base.options.id
      }, (info) => {
        this.Base.setMyData(info);
      });
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
  } 
  orderdateChange(e){
    this.Base.setMyData({orderdate:e.detail.value});
  }
  ordertimeChange(e) {
    this.Base.setMyData({ ordertime: e.detail.value });
  }
  changequote(){
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry?id='+this.Base.options.id,
    })
  }
  copyquote() {
    wx.navigateTo({
      url: '/pages/quoteferry/quoteferry?action=copy&id=' + this.Base.options.id,
    })
  }
  abandonquote(){
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.abandon({
      id: this.Base.options.id
    },(ret)=>{
      if (ret.code == "0") {
        wx.showToast({
          title: '订单放弃成功',
          icon: 'none'
        })
        this.Base.setMyData({status:3});
      }else{
        this.Base.info("放弃失败，请重试");
      }
    });
  }
  confirmOrder(e){
    var data=this.Base.getMyData();
    if(data.orderdate==undefined){
      this.Base.setMyData({ scrollfocus:"dateselect"});
      this.Base.info("请选择订单日期");
      return;
    }
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.confirm({
      orderdate:data.orderdate,
      ordertime:data.ordertime,
      id: this.Base.options.id
    }, (ret) => {
      if (ret.code == "0") {
        wx.redirectTo({
          url: '/pages/success/success?title=订单发起成功',
        })
      } else {
        this.Base.info(ret.return);
      }
    });
  }
  openOrder(){

    wx.showToast({
      title: '暂未开放订单跟踪功能',
      icon: 'none'
    })
  }
} 
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab; 
body.orderdateChange = content.orderdateChange;
body.ordertimeChange = content.ordertimeChange;
body.changequote = content.changequote;
body.copyquote = content.copyquote; 
body.abandonquote = content.abandonquote;
body.confirmOrder = content.confirmOrder;
body.openOrder = content.openOrder;
Page(body)