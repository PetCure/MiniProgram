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
    this.Base.setMyData({ currenttab: 0, markers: [] });
  }
  onMyShow() {

    mapCtx = wx.createMapContext('map');
    var that = this;
    var mylocation = this.Base.getMyData().mylocation;
    if (mylocation == undefined) {
      that.Base.getAddress((addressinfo) => {
        that.Base.setMyData({ mylocation: addressinfo });
        that.reloaddata();
      });
    }
  }

  createPost() {
    wx.navigateTo({
      url: '/pages/post/post',
    })
  }
  onNewload() {
    var that = this;
    that.Base.getAddress((addressinfo) => {
      that.Base.setMyData({ mylocation: addressinfo });

      var api = new PostApi();
      api.list({
        inmap:"Y",
        mylat: addressinfo.ad_info.location.lat,
        mylng: addressinfo.ad_info.location.lng,
        orderby: "distance limit 0,15"
      }, (list) => {
        var markers = [];
        var uploadpath = that.Base.getMyData().uploadpath;
        var markers = [];
        for (var i = 0; i < list.length; i++) {
          var url = uploadpath + "post/" + list[i].images.split(",")[0];
          var marker=that.addmarker(list[i].id, list[i].cat_id, list[i].lat, list[i].lng, url);
          if (marker != null) {
            markers.push(marker);
          }
        }
        if (markers.length > 0) {
          that.addmarkersline(markers);
          //that.Base.setMyData({ markers });
        }
      });
    });
  }
  reloaddata() {
    var api = new PostApi();
    var mylocation = this.Base.getMyData().mylocation;
    var mylocation = api.list({ inmap: "Y", lat: mylocation.ad_info.location.lat, lng: mylocation.ad_info.location.lng }, (list) => {

    });
  }
  bindupdated(e) {
    var that = this;
    console.log(e);
    if (e.type == "end") {
      console.log(mapCtx);
      mapCtx.getRegion({
        success: function (res) {
          console.log("console success");
          console.log(res);
          var api = new PostApi();
          var mylocation = api.list({
            to_lat: res.northeast.latitude, 
            to_lng: res.northeast.longitude, 
            from_lat: res.southwest.latitude, 
            from_to: res.southwest.longitude ,
            inmap: "Y"}, (list) => {
            if (list.length == 0) {
              return;
            }
            var uploadpath = that.Base.getMyData().uploadpath;
            var markers = [];
            for (var i = 0; i < list.length; i++) {
              var url = uploadpath + "post/" + list[i].images.split(",")[0];
              var marker=that.addmarker(list[i].id, list[i].cat_id, list[i].lat, list[i].lng, url);
              //markers.push({
              // iconPath: "/images/icons/mark.png",
              //  id: list[i].id,
              //  latitude: list[i].lat,
              //  longitude: list[i].lng,
              //  width: 40,
              //  height: 40
              //});
              if(marker!=null){
                markers.push(marker);
              }
            }
            if (markers.length > 0) {
              that.addmarkersline(markers);
              //that.Base.setMyData({ markers });
            }

          }, false);
        },
        fail: function (res) {
          console.log("console fail");
          console.log(res);
        },
        complete: function (res) {

          console.log("console complete");
          console.log(res);
        }
      });
    }
  }
  markerclick(e) {
    console.log(e);
    var id = e.markerId;
    wx.navigateTo({
      url: '/pages/info/info?shownext=Y&id=' + id,
    })
  }
  addmarker(id,cat_id, lat, lng, url) {
    var that = this;
    if (markers[id] != 1) {
      markers[id] = 1;
      //iconPath2: res.tempFilePath,
      console.log("???");
      return {
             iconPath: "/images/icons/mark_" + cat_id+".png",
             id: id,
             latitude: lat,
             longitude: lng,
             width: 40,
             height: 40
          };
      // wx.downloadFile({
      //   url: url,
      //   success(res) {
      //     var c = that.Base.getMyData().markers;
      //     c.push({
      //       iconPath: "/images/icons/mark_" + cat_id+".png",
      //       iconPath2: res.tempFilePath,
      //       id: id,
      //       latitude: lat,
      //       longitude: lng,
      //       width: 40,
      //       height: 40
      //     });
      //     that.Base.setMyData({ markers: c })
      //   }
      // })
    }
    return null;
  }
  addmarkersline(newmarkers){
    var markers = this.Base.getMyData().markers;
    console.log(markers);
    //markers.concat(newmarkers);
    for(var i=0;i<newmarkers.length;i++){
      markers.push(newmarkers[i]);
    }
    console.log(markers);
    this.Base.setMyData({ markers});
  }
}
var markers = [];
var mapCtx = null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.createPost = content.createPost;
body.onNewload = content.onNewload;
body.showHelp = content.showHelp;
body.reloaddata = content.reloaddata;
body.bindupdated = content.bindupdated;
body.markerclick = content.markerclick; 
body.addmarker = content.addmarker;
body.addmarkersline = content.addmarkersline;

Page(body)