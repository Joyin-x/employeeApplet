// pages/my/forgetPassword/forgetPassword.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px    
  },

  submit(e){
    let phone=e.detail.value.phone,
    email=e.detail.value.email;
    if(phone==""){
      wx.showToast({
        title: "手机号不能为空",
        image: '/images/warning.png'
      });
      return;
    }
    if (email == "") {
      wx.showToast({
        title: "邮箱不能为空",
        image: '/images/warning.png'
      });
      return;
    }
    wx.request({
      url: app.globalData.baseUrl+'/own/forgetPassword',
      data:{
        phone:phone,
        email:email,
      },
      success(res){
        console.log(res);
        if(res.data.code==200){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000);
          wx.showToast({
            title: res.data.msg,
            duration:2000
          })
        }
       else{
         wx.showToast({
           title: res.data.msg,
           image:'/images/warning.png'
         })
       }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})