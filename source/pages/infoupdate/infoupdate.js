import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({loaded:false });
  }
  onMyShow() {
    var that = this;
    var loaded = this.Base.getMyData().loaded;
    if(loaded==false){
      var api = new MemberApi();
      api.info({},(info)=>{
        this.Base.setMyData({ introduce: info.introduce, photo: info.avatarUrl, name: info.nickName, loaded: true });
      });
    }
  }
  choosePhoto() {
    var uploadpath=this.Base.getMyData().uploadpath;
    this.Base.uploadImage("member", (photo) => {

      this.Base.setMyData({ photo: uploadpath+"member/"+photo });
    });
  }
  phonenoCallback(mobile) {
    this.Base.setMyData({ mobile });
  }
  confirm(e){
    var data=e.detail.value;
    console.log(data);
    if(data.photo==""){
      this.Base.info("请选择头像");
      return;
    }
    if (data.name == "") {
      this.Base.info("请输入姓名");
      return;
    }
    
    var api = new MemberApi();
    api.infoupdate(data, (ret) => {
      if(ret.code==0){
        wx.navigateBack({
          
        })
      }else{
        this.Base.info("修改提交发送错误");
      }
    });
  }
  reset(e) {
    var data ={name:AppBase.UserInfo.nickName,photo:AppBase.UserInfo.avatarUrl,
    introduce:""};
    

    var api = new MemberApi();
    api.infoupdate(data, (ret) => {
      if (ret.code == 0) {
        wx.navigateBack({

        })
      } else {
        this.Base.info("修改提交发送错误");
      }
    });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.choosePhoto = content.choosePhoto;
body.confirm = content.confirm;
body.reset = content.reset;
Page(body)