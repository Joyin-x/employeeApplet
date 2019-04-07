// pages/my/updatePassword/updatePassword.js
const app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
        StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
        CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
      },

      submit(e) {
        let that = this;
        if (e.detail.value.originalPassword == "") {
          wx.showToast({
            title: '请输入原密码',
            image: '/images/warning.png'
          });
          return;
        }
        if (e.detail.value.newPassword == "") {
          wx.showToast({
            title: '请输入新密码',
            image: '/images/warning.png'
          });
          return;
        }
        if (e.detail.value.newPassword1 == "") {
          wx.showToast({
            title: '请输入确认密码',
            image: '/images/warning.png'
          });
          return;
        }
        if (e.detail.value.newPassword1 != e.detail.value.newPassword) {
          wx.showToast({
            title: '两次密码不一致！',
            image: '/images/warning.png'
          });
          return;
        }
        wx.request({
              url: app.globalData.baseUrl + '/own/updatePassword',
              data: {
                id: wx.getStorageSync('userInfo').id,
                originalPassword:e.detail.value.originalPassword,
                newPassword:e.detail.value.newPassword,
                newPassword1:e.detail.value.newPassword1,
                },
                method: 'POST',
                success: function(res) {
                  console.log(res);
                  if(res.data.code==200){
                    setTimeout(function(){
                      wx.navigateBack({
                        delta:1
                      })
                    },2000);
                    wx.showToast({
                      title: '修改密码成功',
                      duration:2000
                    })
                  }else{
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
          onLoad: function(options) {

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