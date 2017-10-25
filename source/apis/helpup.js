
        //使用方法，下面两句复制到page的js文件的头部，然后你猜
        //var HelpupApi=require('/apis/helpup.js');
        //var helpupApi=new HelpupApi();
        var APIConfig=require('../ApiConfig.js');
        var apiconfig = new APIConfig();
class HelpupApi
{
   //更新求助点赞，传入对应的表字段
    update(field_json,callback){
                  wx.request({
                    url: apiconfig.ServerUrl+'/helpup/update', 
                    data:field_json,
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
module.exports = HelpupApi;
