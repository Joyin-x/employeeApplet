// pages/employeeDetail/employeeDetail.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id: 0, //用来接收传过来的员工id
    list: '' //存储返回的需要显示的员工信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log();
    this.setData({
      id: options.id
    });
    this.getEmployeeDetail();
  },
  //获取员工的基本信息
  getEmployeeDetail: function () {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/employee/getEmployeeInfo',
      method: 'GET',
      data: {
        id: that.data.id
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          let list = res.data.data;
          list.birthday = util.formatDate(new Date(list.birthday));
          that.setData({
            list: list
          });
        }
      }
    });
  },
  //修改用户信息
  update() {
    wx.navigateTo({
      url: '/pages/employee/updateEmployee/updateEmployee?list=' + JSON.stringify(this.data.list),
    })
  },
  //删除该用户
  delete() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除 ' + that.data.list.name + ' 员工吗？',
      confirmColor: '#1E90FF',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + '/employee/deleteEmployee',
            data: {
              id: that.data.id
            },
            success: res => {
              console.log(res);
              if (res.data.code == 200) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  }, 2000)
                });
                wx.showToast({
                  title: '已删除 ' + that.data.list.name + ' 员工',
                  duration: 2000
                });
              }
            }
          })
        }
      }
    })
  },
  //删除员工
  delte() {

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

  },
  //点击图片查看大图
  watchBImg: function () {
    let that = this;
    wx.previewImage({
      urls: [that.data.list.picture],
      current: that.data.list.picture
    })
  },
  modifyInformation: function () {

  }
})