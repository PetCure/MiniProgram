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
    super.onLoad(options);
    this.Base.setMyData({
      currenttab: 0
    });
  }
  onMyShow() {
    var that = this;
    var mylocation = this.Base.getMyData().mylocation;
    if (mylocation == undefined) {
      that.Base.getAddress((addressinfo) => {
        that.Base.setMyData({ mylocation: addressinfo });
      });
    }
    var api=new PostApi();
    api.info({id:this.Base.options.id},(info)=>{
      info.images=info.images.split(",");
      this.Base.setMyData(info);
    });
    this.loadcomment();
  }
  loadcomment(){
    var api = new PostApi();
    api.commentlist({ post_id: this.Base.options.id }, (commentlist) => {
      this.Base.setMyData({ comments:commentlist });
    });
  }

  changeCurrentTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.detail.current
    });
  }
  changeTab(e) {
    console.log(e);
    this.Base.setMyData({
      currenttab: e.currentTarget.id
    });
  }
  sendComment(e){
    var that=this;
    var comment = e.detail.value.comment; var api = new PostApi();
    api.comment({ post_id: this.Base.options.id,comment:comment }, (ret) => {
      that.loadcomment();
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changeCurrentTab = content.changeCurrentTab;
body.changeTab = content.changeTab;
body.loadcomment = content.loadcomment;
body.sendComment = content.sendComment;
Page(body)