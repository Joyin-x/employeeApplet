// pages/notice/notice.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    noticeList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getNoticeList();
  },
  //获取公告列表
  getNoticeList: function() {
    let self = this;
    wx.request({
      url: app.globalData.baseUrl + "/notice/list",
      method: 'GET',
      success: res => {
        if (res.data.code == 200) {
          let noticeList = res.data.data;
          for (let i = 0; i < noticeList.length; i++) {
            noticeList[i].noticeTime = app.timestamp(noticeList[i].noticeTime,1);
          }
          self.setData({
            noticeList: res.data.data
          });
        }
      }
    })
  },
  //跳转到公告通知详情页
  getDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/notice/noticeDetail/noticeDetail?id=' + id,
    })
  },
  //跳转到增加公告信息列
  addNotice: function() {
    wx.navigateTo({
      url: '/pages/notice/addNotice/addNotice'
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
    this.getNoticeList();
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