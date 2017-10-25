
        //使用方法，下面两句复制到page的js文件的头部，然后你猜
        //var HelpApi=require('/apis/help.js');
        //var helpApi=new HelpApi();
        var APIConfig=require('../ApiConfig.js');
        var apiconfig = new APIConfig();
class HelpApi
{
   //获取求助列表，传入对应的搜索条件
    list(searchcondition_json,callback){
                  wx.request({
                    url: apiconfig.ServerUrl+'/help/list', 
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

   //获取求助详情, 传入对应的id
    get(id,callback){
      var json={id:id};
                  wx.request({
                    url: apiconfig.ServerUrl+'/help/get', 
                    data:json,
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

   //更新求助，传入对应的表字段
    update(field_json,callback){
                  wx.request({
                    url: apiconfig.ServerUrl+'/help/update', 
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

   //
                latest(request_json,callback){
                  wx.request({
                    url: apiconfig.ServerUrl+'/help/latest', 
                    data:request_json,
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

                mine(request_json, callback) {
                  wx.request({
                    url: apiconfig.ServerUrl + '/help/mine',
                    data: request_json,
                    method: 'POST',
                    dataType: 'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (callback != null) {
                        callback(res.data);
                      }
                    },
                    fail: function (res) {
                      console.log(res);
                      callback(false);
                    }
                  })
                };
                myup(request_json, callback) {
                  wx.request({
                    url: apiconfig.ServerUrl + '/help/myup',
                    data: request_json,
                    method: 'POST',
                    dataType: 'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (callback != null) {
                        callback(res.data);
                      }
                    },
                    fail: function (res) {
                      console.log(res);
                      callback(false);
                    }
                  })
                };
                allup(request_json, callback) {
                  wx.request({
                    url: apiconfig.ServerUrl + '/help/allup',
                    data: request_json,
                    method: 'POST',
                    dataType: 'json',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      if (callback != null) {
                        callback(res.data);
                      }
                    },
                    fail: function (res) {
                      console.log(res);
                      callback(false);
                    }
                  })
                };
}
module.exports = HelpApi;
