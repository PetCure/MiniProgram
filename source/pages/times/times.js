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
    this.Base.setMyData({list:[]});
  }
  onMyShow() {
    var that = this;
    var mylocation = this.Base.getMyData().mylocation;
    that.Base.getAddress((addressinfo) => {
      that.Base.setMyData({ mylocation: addressinfo });
      this.loaddata();
    });
  }
  
  loaddata() {
    var that = this;
    var api = new PostApi();
    var that = this;
    var list = this.Base.getMyData().list;
    var api = new PostApi();
    var json = {};
    if (list.length == 0) {
      json = {
        intimes:"Y",
        orderby: "post_time desc limit 0,15"
      };
    } else {
      var lastpost = list[0];
      json = {
        intimes: "Y",
        post_time_from: lastpost.post_time + ".99"
      }
    }
    api.list(json, (nlist) => {
      var mylocation = this.Base.getMyData().mylocation;
      if (nlist.length == 0) {
        return;
      }
      wx.showToast({
        title: '发现' + nlist.length + "条记录",
        icon: "none"
      })
      for (var i = 0; i < nlist.length; i++) {
        var mile = GetDistance(mylocation.ad_info.location.lat, mylocation.ad_info.location.lng, nlist[i].lat, nlist[i].lng);
        if (mile > 1000) {
          mile = "约" + (mile / 1000.0).toFixed(1) + "千米";
        } else if (mile < 100) {

          mile = "100米内";
        } else {
          mile = "约" + (mile).toString() + "米";
        }
        nlist[i].images = nlist[i].images.split(",");
        nlist[i].mile = mile;
        nlist[i].timeduration = time_ago(nlist[i].post_time_timespan);

      }
      for (var i = 0; i < list.length; i++) {
        nlist.push(list.postlist[i]);
      }
      that.Base.setMyData({ list:nlist });
    });




  }
  onReachBottom() {

    var that = this;
    var api = new PostApi();
    var that = this;
    var list = this.Base.getMyData().list;
    var api = new PostApi();
    var lastpost = list[list.length - 1];
    console.log(lastpost.post_time_timespan);
    var lasttimespan = lastpost.post_time_timespan - 1;
    var lasttimespan_str = this.Base.util.FormatDateTime(new Date(lasttimespan * 1000)) + ".99";
    var json = {
      post_time_to: lasttimespan_str,
      intimes: "Y",
      orderby: "post_time desc limit 0,10"
    }
    api.list(json, (nlist) => {
      if (nlist.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: "none"
        })
        return;
      }
      var mylocation = this.Base.getMyData().mylocation;
      for (var i = 0; i < nlist.length; i++) {
        var mile = GetDistance(mylocation.ad_info.location.lat, mylocation.ad_info.location.lng, nlist[i].lat, nlist[i].lng);
        if (mile > 1000) {
          mile = "约" + (mile / 1000.0).toFixed(1) + "千米";
        } else if (mile < 100) {

          mile = "100米内";
        } else {
          mile = "约" + (mile).toString() + "米";
        }
        nlist[i].images = nlist[i].images.split(",");
        nlist[i].mile = mile;
        nlist[i].timeduration = time_ago(nlist[i].post_time_timespan);

        list.push(nlist[i]);
      }
      that.Base.setMyData({ list: list });
    });




  }
}
var count = 0;
function Rad(d) {
  return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // 地球半径，千米;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = Math.round(s * 1000) / 1; //单位修改为米,取整
  //s=s.toFixed(4);
  return s;
}

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
body.onReachBottom = content.onReachBottom;

body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loaddata = content.loaddata;

Page(body)