// pages/addEmployee/addEmployee.js
const app = getApp();
const md5 = require("../../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: '',
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    url: '',
    password:'123456',
    phone:'81722929',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
    console.log(this.data.userInfo);
  },
  /**
   * 
   */
  formSubmit(e) {
    this.upload(this);
  },
  upload: function(that) {
    console.log(that.data.photos);
    wx.uploadFile({
      url: app.globalData.baseUrl + '/notice/addImage',
      filePath: that.data.photos,
      name: 'file',
      method: "POST",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        'user': that.data.userInfo.userId
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  chooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        that.setData({
          photos: res.tempFilePaths[0],

        });
        console.log(that.data.photos);
      }

    });
  },
  a(){
    console.log(md5.hex_md5(this.data.password + md5.hex_md5(this.data.phone)),);
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