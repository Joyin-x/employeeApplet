// pages/login/login.js
const md5 = require("../../../utils/md5.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    data: '', //后台返回的用户信息
    url: '', //微信返回的用户头像
    catchImg: "http://localhost:8080/ssmstart_war/department/verification"
  },
  //忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: '/pages/my/forgetPassword/forgetPassword',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //登录表单提交
  loginSubmit: function(e) {
    let that = this,
      info = e.detail.value;
    if (info.phone == "") {
      wx.showToast({
        title: '手机号不能为空!',
        image: '/images/warning.png'
      });
      return;
    }
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(info.phone))) {
      wx.showToast({
        title: '手机号格式有误',
        image: '/images/warning.png'
      });
      return;
    }
    if (info.password == "") {
      wx.showToast({
        title: '密码不能为空!',
        image: '/images/warning.png'
      });
      return;
    }
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    wx.request({
      url: app.globalData.baseUrl + '/employee/login',
      data: {
        phone: info.phone,
        password: md5.hex_md5(info.password + md5.hex_md5(info.phone)),
      },
      method: 'POST',
      success: function(res) {
        console.log(res);
        if (res.data.code == 200) {
          let data = res.data.data;
          data.department_name=app.getDepartmentName(data.department_id);
          wx.setStorageSync('userInfo', data);
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
            wx.showToast({
              title: '登陆成功',
              duration: 2000
            });
            wx.hideLoading();
          });
        } else {
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false,
            confirmColor: "#00c8fa"
          })
          wx.hideLoading();
        }
      }
    });
  },
  //显示隐藏用户授权窗口
  showModal() {
    this.setData({
      modalName: true
    })
  },
  hideModal() {
    this.setData({
      modalName: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
