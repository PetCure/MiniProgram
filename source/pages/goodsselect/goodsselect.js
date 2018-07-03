// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { GoodsApi } from "../../apis/goods.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    if (options.goods == undefined) {
      this.Base.setMyData({ goods: [] });
    } else {
      this.Base.setMyData({ goods: JSON.parse(options.goods) });
    }

  }
  onMyShow() {
    var that = this;
    var goodsapi=new GoodsApi();
    goodsapi.list({},(goodslist)=>{
      this.Base.setMyData({ goodslist});
    });
    this.calc();
  }
  goodsSelect(e){
    console.log(e);
    var goodslist = this.Base.getMyData().goodslist;
    var g=JSON.parse(JSON.stringify( goodslist[e.detail.value]));
    g.val=0;
    console.log(g);

    var goods = this.Base.getMyData().goods;
    goods[e.currentTarget.id]=g;
    this.Base.setMyData({ goods, idx_focus: e.currentTarget.id});
    this.calc();
  }
  changeVal(e){
    var seq = e.currentTarget.id;
    var val = e.detail.value; 
    var goods = this.Base.getMyData().goods;
    goods[seq].val = val;
    this.Base.setMyData({ goods });
    this.calc();
  }
  calc(){
    var weight=0;
    var goods = this.Base.getMyData().goods;
    for(var i=0;i<goods.length;i++){
      weight += goods[i].val * goods[i].exchange;
    }
    if(weight>=1000){
      weight = (weight/1000).toFixed(2)+"吨";
    }else{
      weight = (weight ).toFixed(2) + "公斤";
    }
    this.Base.setMyData({ weight });
  }
  minus(e){
    var seq = e.currentTarget.id;
    var goods = this.Base.getMyData().goods;
    var ngoods=[];
    for(var i=0;i<goods.length;i++){
      if(seq!=i){
        ngoods.push(goods[i]);
      }
    }
    this.Base.setMyData({ goods: ngoods });
    this.calc();
  }
  confirm(){
    var data = this.Base.getMyData();
    if (data.goods.length==0) {
      this.Base.info("请至少添加一个货物");
      return;
    }
    var ret = {
      goods: data.goods,
      weight: data.weight
    };
    this.dataReturn(ret);
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow; 
body.goodsSelect = content.goodsSelect;
body.changeVal = content.changeVal;
body.calc = content.calc; 
body.minus = content.minus;
body.confirm = content.confirm;
Page(body)