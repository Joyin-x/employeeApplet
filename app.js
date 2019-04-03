//app.js

App({
  onLaunch: function() {
    let that=this;
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
     //this.checkLogin();

  },
  requestPost: function(url, data) {
    return new Promise((resolve, reject) => {
      //初始化
      var that = this;
      var postData = data;
      //网络请求
      wx.request({
        url: url,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) { //服务器返回数据
          if (res.data.code == 200) {
            resolve(res.data.data);
          } else { //返回错误提示信息
            reject(res.data.msg);
          }
        },
        error: function(e) {
          reject('网络出错');
        }
      })
    });
  },
  requestGet: function(url, data) {
    return new Promise((resolve, reject) => {
      //初始化
      var that = this;
      var getData = data;
      //网络请求
      wx.request({
        url: url,
        data: getData,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) { //服务器返回数据
          console.log(res);
          if (res.data.code == 200) {
            resolve(res.data.data);
          } else { //返回错误提示信息
            reject(res.data.msg);
          }
        },
        error: function(e) {
          reject('网络出错');
        }
      })
    });
  },
  //登录验证
  checkLogin:function(){
    var that=this;
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          // 发起网络请求
          
          wx.request({
            url: that.globalData.baseUrl +'/returnUUID',
            data: {
              code: res.code
            },
            success(response){
              that.globalData.uuid=response.data.data;
              that.getSession();
              console.log(response);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  getSession(){
    let that=this;
    wx.request({
      url: that.globalData.baseUrl + '/checkCUUID',
      data: {
        uuid: that.globalData.uuid
      },
      success(response) {
        console.log(response);
      }
    })
  },
  //时间戳转换为时间(0返回时分秒，1不返回)
  timestamp(timestamp,flag) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    if(flag==0){
      return Y + M + D + h + m + s;
    }else{
      return Y + M + D;
    }
  },
//http://localhost:8080/ssmstart_war/
//https://weixiong.info
  globalData: {
    baseUrl: 'http://localhost:8080/ssmstart_war/',
    url:null,
    uuid:''
  }
})