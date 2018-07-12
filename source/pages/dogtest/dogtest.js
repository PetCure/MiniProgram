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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      pg: 1,
      anwser: {
        noitem: true,
        dog: [{
          body_type: "中型犬",
          breed: "比利时牧羊犬",
          combat: "一般",
          hair: "长毛",
          image: "http://pic2.58.com/m58/shaixuan/比利时牧羊犬.png",
          kindly: "一般",
          link: "bmuyangquan",
          lively: "一般"
        }],
        master: {
          area: "根据您的饲养宠物环境大小，建议您饲养小型、或中型犬种。",
          baby: "null",
          budget: "您选择中小型犬，该范围宠物吃喝应该基本保障，但是如果宠物需要修毛，美容，洗澡，护理，预算就略微紧张啦。",
          character: "您是成熟、稳重、豁达、豪爽、精明干练的人。有一种以不变应万变的淡定，喜欢向困难发起挑战，有着誓死拼搏的雄心和霸气。您的性格适合养中大型，忠诚听话的犬种。",
          period: "可照顾狗狗时段分析，您在清晨较无时间。狗狗一般醒的比人要早，并且呆了一夜，狗狗在清晨时最好可以遛弯，以进行大小便排解。并且清晨空气更加清新，为了您狗狗的健康，建议您清晨可以至少带狗狗出门方便。↵根据您可照顾狗狗时段分析，您可以增加晚上遛狗时间。让您的狗狗，在晚上遛弯方便后再回家入睡。避免第二天早上狗狗在家中因为方便而被憋难受。↵",
          sunshine: "您养宠阳光条件良好，建议您可以经常带宠物户外活动，以补充更多的阳光。",
          time: "您可投入照顾犬的时间是0-1小时，您选择的是中型犬。↵您的照顾时间，较为不足。中型犬建议您每天至少两次遛狗，每次遛狗时间不少于30分钟，请您适度增加照顾犬的时间，以保证您狗狗的身心健康。"
        }
      }
      
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
    this.Base.setMyData({ pg: 3 });
  }
  pg1(){
    this.Base.setMyData({pg:1});
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