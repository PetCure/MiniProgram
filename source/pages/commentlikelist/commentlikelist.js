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
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    count=0;
    var api = new PostApi();
    api.commentlikelist({
      orderby: "r_main.like_time desc limit 0,15"
    }, (list) => {
      for (var i = 0; i < list.length; i++) {
        list[i].timeduration = time_ago(list[i].like_time_timespan);
      }
      count=0;
      that.Base.setMyData({ list: list });

    });
  }

  onReachBottom() {
    var that = this;
    var api = new PostApi();
    api.commentlikelist({
      orderby: "r_main.like_time desc limit " + (15 + count * 5).toString() + ",5"
    }, (list) => {
      var newslist = that.Base.getMyData().list;
      for (var i = 0; i < list.length; i++) {
        list[i].timeduration = time_ago(list[i].like_time_timespan);
        newslist.push(list[i]);
      }
      count++;
      that.Base.setMyData({ list: newslist });
    });
  }
  openmember(e){
var id=e.currentTarget.id;
wx.navigateTo({
  url: '/pages/memberinfo/memberinfo?id='+id,
})
  }
  openmember(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/memberinfo/memberinfo?id=' + id,
    })
  }
  openpost(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/info/info?id=' + id,
    })
  }
} 


var count=0;

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
body.openpost = content.openpost;
Page(body)