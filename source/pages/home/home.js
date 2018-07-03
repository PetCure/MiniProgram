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
    this.Base.setMyData({ currenttab: 0,markers:[] });
  }
  onMyShow() {

    mapCtx = wx.createMapContext('map');
    var that = this;
    var mylocation = this.Base.getMyData().mylocation;
    if (mylocation == undefined) {
      that.Base.getAddress((addressinfo) => {
        that.Base.setMyData({ mylocation: addressinfo });
      });
    }
  }

  createPost(){
    wx.navigateTo({
      url: '/pages/post/post',
    })
  }
  onNewload(){
    var that = this;
    that.Base.getAddress((addressinfo) => {
      that.Base.setMyData({ mylocation: addressinfo });
    });
  }
  reloaddata(){
    var api=new PostApi();
    var mylocation = this.Base.getMyData().mylocation;
    var mylocation = api.list({ inmap: "Y", lat: mylocation.ad_info.location.lat, lng: mylocation.ad_info.location.lng},(list)=>{

    });
  }
  bindupdated(e){
    var that=this;
    console.log(e);
    if(e.type=="end"){
      console.log(mapCtx);
      mapCtx.getRegion({
        success: function (res) {
          console.log("console success");
          console.log(res);
          var api = new PostApi();
          var mylocation = api.list({ to_lat: res.northeast.latitude, to_lng: res.northeast.longitude, from_lat: res.southwest.latitude, from_to: res.southwest.longitude }, (list) => {

            var markers= [];
            for(var i=0;i<list.length;i++){
              markers.push({
                iconPath: "/images/icons/mark.png",
                id: list[i].id,
                latitude: list[i].lat,
                longitude: list[i].lng,
                width: 50,
                height: 50
              });
            }

            that.Base.setMyData({ markers});
          });
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
  markerclick(e){
    console.log(e);
    var id=e.markerId;
    wx.navigateTo({
      url: '/pages/info/info?id='+id,
    })
  }
}

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

Page(body)