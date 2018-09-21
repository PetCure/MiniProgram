// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { PostApi } from "../../apis/post.api.js";
import { MemberApi } from "../../apis/member.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  timer = null;
  onLoad(options) {
    this.Base.Page = this;
    //options.member_id=18;
    super.onLoad(options);
    this.Base.setMyData({ chatlist:[]});
    try{
      clearInterval(this.Base.timer);
    }catch(e){

    }
    this.Base.timer=null;
  }
  onMyShow() {
    var that = this;
    count = 0;
    var memberApi = new MemberApi();
    memberApi.info({ fmember_id: this.Base.options.member_id }, (memberinfo) => {
      if (memberinfo != null) {
        this.Base.setMyData({ chatedmember: memberinfo, chatmember_id: this.Base.options.member_id });
        wx.setNavigationBarTitle({
          title: "和"+memberinfo.nickName+"正在聊天...",
        })
      }
      
    });

    console.log("timer");
    if (this.Base.timer==null){
      this.Base.timer=setInterval(function(){
      var api = new MemberApi();
      var chatlist = that.Base.getMyData().chatlist;
      var json={f_id:that.Base.options.member_id};
      if (chatlist.length > 0) {
        console.log(chatlist[chatlist.length - 1].sent_time + ".99");
        json.sent_time_from = chatlist[chatlist.length-1].sent_time+".99";
      }
      console.log(json);
      api.chatlist(json, (list) => {
        if(list.length==0){
          return;
        }
        for (var i = 0; i < list.length; i++) {
          list[i].timeduration = time_ago(list[i].sent_time_timespan);
          chatlist.push(list[i]);
        }

        that.Base.setMyData({ chatlist: chatlist, intoid: chatlist[chatlist.length - 1].id  });
      }, false);
    },1000);
  }
  }
  onUnload(){
    clearInterval(this.Base.timer);
  }

  openmember(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/memberinfo/memberinfo?id=' + id,
    })
  }

  send(e){
    console.log(e);
    //if(e.)
    var msg=e.detail.value.msg;
    if(msg.trim()==""){
      wx.showToast({
        title: '至少写点东西才能发送',
        icon:"none"
      });
      return;
    }
    var api = new MemberApi();
    api.chat({received_member_id:this.Base.options.member_id,msg:msg,photo:''},(ret)=>{

    });
    this.Base.setMyData({msg:""});
  }
  sendPhoto(){
    this.Base.uploadOneImage("memberchat",(image)=>{
      var api = new MemberApi();
      api.chat({ received_member_id: this.Base.options.member_id, msg: "", photo: image }, (ret) => {

      });
    });
  }
  
}


var count = 0;
function time_ago(agoTime) {

  // 计算出当前日期时间到之前的日期时间的毫秒数，以便进行下一步的计算
  var time = (new Date()).getTime() / 1000 - agoTime;

  var num = 0;
  if (time >= 31104000) { // N年前
    num = parseInt(time / 31104000);
    return num + '年前';
  }
  if (time >= 2592000) { // N月前
    num = parseInt(time / 2592000);
    return num + '月前';
  }
  if (time >= 86400) { // N天前
    num = parseInt(time / 86400);
    return num + '天前';
  }
  if (time >= 3600) { // N小时前
    num = parseInt(time / 3600);
    return num + '小时前';
  }
  if (time > 60) { // N分钟前
    num = parseInt(time / 60);
    return num + '分钟前';
  }
  return '1分钟前';
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.openmember = content.openmember;
body.send = content.send;
body.onUnload = content.onUnload;
body.sendPhoto = content.sendPhoto;

Page(body)