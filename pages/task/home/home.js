const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    emplyeeList: [], //员工信息
    TabCur: 0, //左侧标签栏下标
    VerticalNavTop: 0, //右侧文本区下标
    departmentList: '', //返回的现有部门信息
    userInfo: '', //登录返回的用户信息
  },
  //左侧标签栏下标改变
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  getInfo() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: userInfo
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo();
    let userInfo = this.data.userInfo;
    if (userInfo.flag == 0) {
      wx.showModal({
        title: '警告',
        content: userInfo.name + ',你的职位为' + userInfo.position + ',没有权限指派任务！',
        showCancel: false,
        confirmText: "返回",
        confirmColor: "#00BFFF",
        success: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      });
    } else {
      //获取各部门用户员工信息
      this.getEmployeeList();
    }

  },
  //获取所有部门员工的的信息
  getEmployeeList() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/department/getDepartmentEmployee',
      data: {
        id: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            emplyeeList: res.data.data,
          });
        }
      }
    });
  },
  //跳转到增加任务页面
  addTask: function(e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      departmentName = e.currentTarget.dataset.departname,
      position = e.currentTarget.dataset.position;
    wx.navigateTo({
      url: '/pages/task/addTask/addTask?id=' + id + "&name=" + name + "&departmentName=" + departmentName + "&position=" + position,
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