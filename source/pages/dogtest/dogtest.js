// pages/content/content.js
import {AppBase} from "../../appbase";
import {ApiConfig} from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { TestApi } from "../../apis/test.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      pg: 1
    });
  }
  onMyShow() {
    var that = this;
  }
  character(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      character: val,
      pg: 2
    });
  }
  time(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      time: val
    });
  }
  period_1(e) {
    var val = this.Base.getMyData().period_1 == "1" ? "0" : "1";
    this.Base.setMyData({
      period_1: val
    });
  }
  period_2(e) {
    var val = this.Base.getMyData().period_2 == "1" ? "0" : "1";
    this.Base.setMyData({
      period_2: val
    });
  }
  period_3(e) {
    var val = this.Base.getMyData().period_3 == "1" ? "0" : "1";
    this.Base.setMyData({
      period_3: val
    });
  }
  baby(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      baby: val
    });
  }
  area(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      area: val
    });
  }
  sunshine(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      sunshine: val
    });
  }
  budget(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      budget: val
    });
  }
  body_type(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      body_type: val
    });
  }
  hair(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      hair: val
    });
  }
  lively(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      lively: val
    });
  }
  kindly(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      kindly: val
    });
  }
  combat(e) {
    var val = e.currentTarget.id;
    this.Base.setMyData({
      combat: val
    });
  }
  anwser() {
    var data = this.Base.getMyData();
    if (data.time == undefined) {
      wx.showToast({
        title: '请选择搭理宠物的时常',
        icon: "none"
      });
      return;
    }
    var period = (data.period_1 == "1" ? "1" : "0") + (data.period_2 == "1" ? "1" : "0") + (data.period_3 == "1" ? "1" : "0");
    data.period = period;
    if (period == "000") {
      wx.showToast({
        title: '至少选择一个照顾宠物的空闲时段',
        icon: "none"
      });
      return;
    }
    if (data.baby == undefined) {
      wx.showToast({
        title: '请选择你的宝宝计划',
        icon: "none"
      });
      return;
    }
    if (data.area == undefined) {
      wx.showToast({
        title: '请选择你的养宠环境',
        icon: "none"
      });
      return;
    }
    if (data.sunshine == undefined) {
      wx.showToast({
        title: '请选择你的阳光条件',
        icon: "none"
      });
      return;
    }
    if (data.budget == undefined) {
      wx.showToast({
        title: '请选择你的养宠预算',
        icon: "none"
      });
      return;
    }
    if (data.body_type == undefined) {
      wx.showToast({
        title: '请选择你喜欢的宠物体型',
        icon: "none"
      });
      return;
    }
    if (data.hair == undefined) {
      wx.showToast({
        title: '请选择你喜欢的宠物毛长',
        icon: "none"
      });
      return;
    }
    if (data.lively == undefined) {
      wx.showToast({
        title: '请选择你喜欢的宠物活泼程度',
        icon: "none"
      });
      return;
    }
    if (data.kindly == undefined) {
      wx.showToast({
        title: '请选择你喜欢的宠物友好度',
        icon: "none"
      });
      return;
    }
    if (data.combat == undefined) {
      wx.showToast({
        title: '请选择你喜欢的宠物战斗力',
        icon: "none"
      });
      return;
    }
    var master = { character: data.character,
      time: data.time,
      period: { "1": data.period_1, "2": data.period_2, "3": data.period_3},
      baby: data.baby,
      area: data.area,
      sunshine: data.sunshine,
      budget: data.budget
    };
    var dog = {
      body_type: data.body_type,
      hair: data.hair,
      lively: data.lively,
      kindly: data.kindly,
      combat: data.combat,
    };
    var url = "http://3g.ganji.com/pet/util.php?f=petDogRecommend&master=" + JSON.stringify(master) + "&dog=" + JSON.stringify(dog);

    data.url=url;
    var api = new TestApi();
    api.dogtest(data,(ret)=>{
      this.Base.setMyData({anwser:ret,pg:3});
    });

    this.Base.setMyData({
      pg: 3
    });
  }
  pg1() {
    this.Base.setMyData({
      pg: 1
    });
  }
}









var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.character = content.character;
body.time = content.time;
body.period_1 = content.period_1;
body.period_2 = content.period_2;
body.period_3 = content.period_3;
body.baby = content.baby;
body.area = content.area;
body.sunshine = content.sunshine;
body.budget = content.budget;
body.body_type = content.body_type;
body.hair = content.hair;
body.lively = content.lively;
body.kindly = content.kindly;
body.combat = content.combat;
body.anwser = content.anwser;
body.pg1 = content.pg1;

Page(body)