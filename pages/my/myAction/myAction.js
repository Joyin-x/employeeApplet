// pages/my/my.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    userInfo:'',//用户信息
    DialogModal1:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserinfo();
  },
  //点击图片查看大图
  watchBImg: function () {
    let that = this;
    wx.previewImage({
      urls: [that.data.userInfo.picture],
      current: that.data.userInfo.picture
    });
  },
  //检查是否登录
	checkLogin(){
    if (this.data.userInfo == ''){
			wx.navigateTo({
				url: '/pages/my/login/login',
			});
		}
	},
  //点击显示我的页面操作
	doAction(e){
    if (this.data.userInfo!=''){
      if (e.currentTarget.dataset.flag==6){
        wx.removeStorageSync("userInfo");
        this.getUserinfo();
        wx.showToast({
          title:'退出登录'
        });
        wx.navigateTo({
          url: '/pages/my/login/login',
        })
      }else if(e.currentTarget.dataset.flag==5){
        wx.navigateTo({
          url: '/pages/my/updatePassword/updatePassword',
        })
      }
      else{
        wx.navigateTo({
          url: '/pages/my/myInformation/myInformation?flag=' + e.currentTarget.dataset.flag,
        });
      }
		}else{
      wx.navigateTo({
        url: '/pages/my/login/login',
      });
		}
	},
  //获取用户登陆后的信息
  getUserinfo(){
    let userInfo=wx.getStorageSync("userInfo");
    this.setData({
      userInfo:userInfo
    });
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
    this.getUserinfo();
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