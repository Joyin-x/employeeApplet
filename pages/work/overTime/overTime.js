// pages/work/overTime/overTime.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,//手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar,//设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  doAction(e){
    let flag=e.currentTarget.dataset.flag;
    this.getInfo();
    let userInfo = this.data.userInfo;
    if(userInfo.flag==0&&flag==2){
      wx.showModal({
        title: '警告',
        content: userInfo.name + ',你的职位为' + userInfo.position + ',没有权限审核加班申请！',
        showCancel: false,
        confirmText: "返回",
        confirmColor: "#00BFFF",
      });
      return;
    }else{
      wx.navigateTo({
        url: '/pages/work/overTimeAction/overTimeAction?id=' + e.currentTarget.dataset.flag,
      })
    }
  },
  //获取登录用户信息
  getInfo() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
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