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
    this.Base.setMyData({ catlist:[] });
  }
  onMyShow() {
    var that=this;
    var instapi=new InstApi();
    instapi.indexbanner({}, (indexbanner)=>{
      that.Base.setMyData({ indexbanner});
    });

    var catlist = this.Base.getMyData().catlist;
    if(catlist.length==0){

    var api = new PostApi();
    api.catlist({}, (catlist) => {
      for (var i = 0; i < catlist.length; i++) {
        catlist[i].postlist = [];
      }
      this.Base.setMyData({ catlist });
      this.loaddata();
    });
    }
  }
  onPullDownRefresh(){

    this.Base.setMyData({ catlist: [] });
    this.onMyShow();
  }
  comingsoon(){
    wx.showToast({
      title: '很快就有了，等等我~~~~',
      icon:"none"
    })
  }
  loaddata(){
    var catlist = this.Base.getMyData().catlist;
    this.loaddefaultdata(catlist[0].id);
  }
  loaddefaultdata(cat_id){
    var that=this;
    var api = new PostApi();
    api.list({
      cat_id:cat_id,
      orderby:" likecount desc limit 0,6 "
    }, (postlist) => {
      for (var i = 0; i < postlist.length; i++) {
        postlist[i].cover = postlist[i].images.split(",")[0];
      }
      var catlist = this.Base.getMyData().catlist;
      for(var i=0;i<catlist.length;i++){
        if (catlist[i].id==cat_id){
          catlist[i].postlist=postlist;
          that.Base.setMyData({ catlist});
          if(i<catlist.length-1){
            that.loaddefaultdata(catlist[i+1].id);
          }
        }
      }
    });
  }
  randomload(e) {
    var id = e.currentTarget.id;
    var cat_id=id;
    var that = this;
    var api = new PostApi();
    api.list({
      cat_id: cat_id,
      orderby: " rand() limit 0,6 "
    }, (postlist) => {
      for (var i = 0; i < postlist.length; i++) {
        postlist[i].cover = postlist[i].images.split(",")[0];
      }
      var catlist = this.Base.getMyData().catlist;
      for (var i = 0; i < catlist.length; i++) {
        if (catlist[i].id == cat_id) {
          catlist[i].postlist = postlist;
          that.Base.setMyData({ catlist });
        }
      }
    });
  }
} 
var markers=[];
var mapCtx = null;
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.comingsoon = content.comingsoon; 
body.loaddata = content.loaddata; 
body.randomload = content.randomload; 
body.loaddefaultdata = content.loaddefaultdata;
body.onPullDownRefresh = content.onPullDownRefresh;

Page(body)