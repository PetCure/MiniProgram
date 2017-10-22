
        //使用方法，下面两句复制到page的js文件的头部，然后你猜
        //var HelpphotoApi=require('/apis/helpphoto.js');
        //var helpphotoApi=new HelpphotoApi();
        var APIConfig=require('../ApiConfig.js');
        var apiconfig = new APIConfig();
class HelpphotoApi
{
   //获取求助图片列表，传入对应的搜索条件
    list(searchcondition_json,callback){
                  wx.request({
                    url: apiconfig.ServerUrl+'/helpphoto/list', 
                    data:searchcondition_json,
                    method:'POST',
                    dataType:'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if(callback!=null){
                        callback(res.data);
                      }
                    },
                    fail:function(res){
                      console.log(res);
                      callback(false);
                    }
                  })
                };


}
module.exports = HelpphotoApi;
