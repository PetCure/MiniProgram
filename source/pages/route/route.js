// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    if(options.route==undefined){
      this.Base.setMyData({ route: [null, null] });
    //this.Base.setMyData({route: [{ title: "电影大厦", location: { lat: 22.54478, lng: 114.1132 } }, {title: "宁水花园", location:{ lat: 22.5613, lng: 114.14539 } }] });
    } else {
      console.log("route");
      console.log(options.route);
      var route = JSON.parse(options.route);
      console.log(route);
      this.Base.setMyData({ route: route });
    }
  }
  onMyShow() {
    var that = this;
    var mylocation=this.Base.getMyData().mylocation;
    if(mylocation==undefined){
      that.Base.getAddress((addressinfo) => {
        that.Base.setMyData({ mylocation: addressinfo });
      });
    }

    var route = this.Base.getMyData().route;
    if(route[0]!=null&&route[1]!=null){
      this.makePloyline();
    }
  }
  selectAddress(e){

    //this.makePloyline();
    //return;
    var seq=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/addressselect/addressselect?callbackid='+seq,
    })
  }
  dataReturnCallback(callbackid, data){
    console.log(callbackid);
    var that=this;
    var route=that.Base.getMyData().route;
    route[callbackid] = data;
    that.Base.setMyData({ route: route });
    that.makePloyline();
  }
  addAddress() {
    var that = this;
    var route = that.Base.getMyData().route;
    wx.navigateTo({
      url: '/pages/addressselect/addressselect?callbackid=' + route.length,
    });
  }
  removeAddress(e) {
    var that = this;
    var seq = e.currentTarget.id;
    var route = that.Base.getMyData().route;
    var nroute=[];
    for(var i=0;i<route.length;i++){
      if(i!=seq){
        nroute.push(route[i]);
      }
    }
    this.Base.setMyData({ route: nroute });
    that.makePloyline();
  }
  makePloyline(){
    //http://apis.map.qq.com/ws/direction/v1/driving/?from=39.915285,116.403857&to=39.915285,116.803857&waypoints=39.111,116.112;39.112,116.113&output=json&

    var that=this;
    var frompoint = "";
    var topoint = "";
    var waypoints = [];
    var route = that.Base.getMyData().route;
    var markers=[];
    for (var i = 0; i <route.length;i++){
      if(route[i]!=null){
        if (i == 0) {
          frompoint = route[i].location.lat + "," + route[i].location.lng;
        } else if (i == (route.length-1)) {
          topoint = route[i].location.lat + "," + route[i].location.lng;
        }else{
          waypoints.push(route[i].location.lat + "," + route[i].location.lng);
        }

        markers.push({
          iconPath: "/images/icons/"+(i+1).toString()+".png",
          latitude: route[i].location.lat,
          longitude: route[i].location.lng,
          title: route[i].title,
          width:20,
          height:20
        });


      }
    }
    if(frompoint!=""&&topoint!=""){

      var url = "https://apis.map.qq.com/ws/direction/v1/driving/?callback=cb&key="+AppBase.QQMAPKEY;
      url += "&from=" + frompoint;
      url += "&to=" + topoint;
      if(waypoints.length>0){
        url += "&waypoints=" + waypoints.join(";");
      }
      wx.request({
        url: url,
        success(e){
          console.log(e);
          if(e.data.status==0){
            var data=e.data.result;
            var distance = data.routes[0].distance;
            var duration = data.routes[0].duration;

            if (distance>=1000){
              distance = (distance/1000).toFixed(1)+"公里";
            }else{
              distance = distance + "米";
            }
            if (duration >= 60) {
              duration = (duration / 60).toFixed(0) + "小时" + (duration%60).toString()+"分钟";
            } else {
              duration = duration + "分钟";
            }



            var polyline = data.routes[0].polyline;//[{latitude: 0, longitude: 0}]
            var points = [{ latitude: polyline[0], longitude: polyline[1]}];
            for (var i = 2; i < polyline.length; i=i+2)
            {
              //console.log(i);
              polyline[i] = polyline[i - 2] + polyline[i] / 1000000;
              polyline[i + 1] = polyline[i+1 - 2] + polyline[i+1] / 1000000;
              points.push({ latitude: polyline[i], longitude: polyline[i + 1] });
             }

            //for (var i = 0; i < data.routes.length;i++){
            //  for (var j = 0; j < data.routes[i].polyline.length;j++){
            //    polyline.push({ latitude: data.routes[i].polyline[j][0], longitude: data.routes[i].polyline[j][1] });
            //  }
            //}
            that.Base.setMyData({
              polyline: [{
                points: points,
                color: "#F04848",
                width: 4
              }],
              markers: markers, distance: distance, duration: duration});
          }
        }
      })
    }

  }
  confirm(e){
    var data=this.Base.getMyData();
    if(data.route[0]==null){
      this.Base.info("请选择起点");
      return;
    }
    if (data.route[1] == null) {
      this.Base.info("请选择终点");
      return;
    }
    var ret={
      route: data.route,
      distance: data.distance, 
      duration: data.duration
    };
    this.dataReturn(ret);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.selectAddress = content.selectAddress; 
body.dataReturnCallback = content.dataReturnCallback;
body.addAddress = content.addAddress; 
body.removeAddress = content.removeAddress; 
body.makePloyline = content.makePloyline;
body.confirm = content.confirm;
Page(body)