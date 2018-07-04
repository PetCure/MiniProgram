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
    var mylocation = this.Base.getMyData().mylocation;
      that.Base.getAddress((addressinfo) => {
        that.Base.setMyData({ mylocation: addressinfo });
        var api=new PostApi();
        api.list({
          mylat: addressinfo.ad_info.location.lat,
          mylng: addressinfo.ad_info.location.lng,
          orderby: "distance limit 0,15"
        }, (list) => {
          for (var i = 0; i < list.length; i++) {
            var mile = GetDistance(addressinfo.ad_info.location.lat, addressinfo.ad_info.location.lng, list[i].lat, list[i].lng);
            if(mile>1000){
              mile="约"+(mile/1000.0).toFixed(1)+"千米";
            } else if (mile < 100) {

              mile = "100米内";
            }else{
              mile = "约" + (mile ).toString() + "米";
            }
            list[i].cover = list[i].images.split(",")[0];
            list[i].mile = mile;
            list[i].timeduration = time_ago(list[i].post_time_timespan);
          }
          that.Base.setMyData({ list: list });
        });
      });
    
  }
  onReachBottom(){
    var that=this;
    var addressinfo = this.Base.getMyData().mylocation;
    var api = new PostApi();
    api.list({
      mylat: addressinfo.ad_info.location.lat,
      mylng: addressinfo.ad_info.location.lng,
      orderby: "distance limit " + (15 + count * 5).toString() + ",5"
    }, (list) => {
      var newslist=that.Base.getMyData().list;
      for (var i = 0; i < list.length; i++) {
        var mile = GetDistance(addressinfo.ad_info.location.lat, addressinfo.ad_info.location.lng, list[i].lat, list[i].lng);
        if (mile > 1000) {
          mile = "约" + (mile / 1000.0).toFixed(1) + "千米";
        } else if (mile < 100) {

          mile = "100米内";
        } else {
          mile = "约" + (mile).toString() + "米";
        }
        list[i].cover = list[i].images.split(",")[0];
        list[i].mile = mile;
        list[i].timeduration = time_ago(list[i].post_time_timespan);
        newslist.push(list[i]);
      }
      count++;
      that.Base.setMyData({ list: newslist });
    });
  }
}
var count=0;
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
  var time = (new Date()).getTime()/1000 - agoTime; 

  var num=0;
  if (time >= 31104000) { // N年前
    num = parseInt(time / 31104000);
    return num+'年前';
  }
  if (time >= 2592000) { // N月前
    num = parseInt(time / 2592000);
    return num+'月前';
  }
  if (time >= 86400) { // N天前
    num = parseInt(time / 86400);
    return num+'天前';
  }
  if (time >= 3600) { // N小时前
    num = parseInt(time / 3600);
    return num+'小时前';
  }
  if (time > 60) { // N分钟前
    num = parseInt(time / 60);
    return num+'分钟前';
  }
  return '1分钟前';
}

var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.onReachBottom = content.onReachBottom;
Page(body)