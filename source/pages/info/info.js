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
    //options.id=6;
    super.onLoad(options);
    if (options.showcomment=="Y"){

      this.Base.setMyData({
        currenttab: 1
      });
    }else{

      this.Base.setMyData({
        currenttab: 0
      });
    }

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
      if(this.Base.options.comment_id!=undefined){
        this.Base.setMyData({
          comments: commentlist,
          into_comment_id: "comment_" + this.Base.options.comment_id
        });
        this.Base.options.comment_id = undefined;
      }else{

        this.Base.setMyData({
          comments: commentlist
        });
      }
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
    console.log(e);
    var that=this;
    var comment = e.detail.value.comment; 
    var api = new PostApi();
    api.comment({ post_id: this.Base.options.id, comment: comment, formid: e.detail.formId }, (ret) => {
      that.loadcomment();
      that.Base.setMyData({ comment:""});
    });
  }
  onShareAppMessage(e){
    console.log(e);
    var data=this.Base.getMyData();
    var title=data.title;
    try{

      if (e.target.dataset.comment != undefined) {
        title = e.target.dataset.comment;
      }
    }catch(e){
    }
    return {
      title:title,
      imageUrl: data.uploadpath+"post/"+data.images[0],
    };
  }
  like(){
    var api = new PostApi();
    api.like({ post_id: this.Base.options.id });

    var data = this.Base.getMyData();
    this.Base.setMyData({liked:true,likecount:data.likecount+1});
  }
  follow(){

    var api = new PostApi();
    api.follow({ post_id: this.Base.options.id }, (ret) => {
      var data = this.Base.getMyData();
      if(ret.return==true){
        console.log("???");
        this.Base.setMyData({ followed: true, followcount: data.followcount + 1 });
      }else{

        this.Base.setMyData({ followed: false, followcount: data.followcount - 1 });
      }
    });

  }
  fix(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '删除后就再也找不回了，你确定吗？',
      success:function(res){
        if(res.confirm){

          var api = new PostApi();
          api.fix({ post_id: that.Base.options.id });

          wx.showToast("删除成功～最后再看一眼吧");
        }
      }
    });
    
  }
  poster(){

    var that = this;
    var url='https://cmsdev.app-link.org/Users/alucard263096/petfind/upload/post/'+this.Base.options.id+'.png';

    that.Base.viewPhoto({ currentTarget: { id: url } });
    return;
    wx.downloadFile({
      url: 'https://cmsdev.app-link.org/Users/alucard263096/petfind/upload/post/'+this.Base.options.id+'.png', //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
          });
          wx.showToast({
            title: '下载分享图片成功',
            icon: "none"
          })
        }else{
          wx.showToast({
            title: '下载分享图片失败',
            icon:"none"
          })
        }
      }
    })
  } 
  viewPhotos(e){
    var current=e.currentTarget.id;
    var images=this.Base.getMyData().images;
    this.Base.viewGallary("post", images, current);
  }
  next(e) {
    var that=this;
    var mylocation = this.Base.getMyData().mylocation;
    var api = new PostApi();
    var json = { post_id: this.Base.options.id, center_lat: mylocation.location.lat, center_lng: mylocation.location.lng };
    console.log(json);
    api.next(json, (next) => {
      if(next.return==0){
        wx.showToast({
          title: '没有下一条了',
          icon:"none"
        })
      }else{
        this.Base.options.id=next.return;
        this.onMyShow();
        //wx.navigateTo({
        //  url: '/pages/info/info?shownext=Y&id='+next.return,
        //})
      }
    });
  }
  likeComment(e){
    var that=this;
    var seq = e.currentTarget.id;
    var comments = this.Base.getMyData().comments; 
    var comment = comments[seq];
    console.log(comment);
    var api = new PostApi();
    api.commentlike({comment_id:comment.id,post_id:comment.post_id},(ret)=>{
      comments[seq].iliked = 'Y';
      comments[seq].likecount = parseInt(comments[seq].likecount)+1;
      that.Base.setMyData({ comments});
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
body.onShareAppMessage = content.onShareAppMessage;
body.like = content.like;
body.follow = content.follow;
body.fix = content.fix;
body.poster = content.poster;
body.viewPhotos = content.viewPhotos; 
body.next = content.next;
body.likeComment = content.likeComment;
Page(body)