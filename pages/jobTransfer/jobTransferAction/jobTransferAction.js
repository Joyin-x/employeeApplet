// pages/jobTransfer/jobTransfer.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    id: "", //传过来的员工id
    name: "", //传过来的员工姓名
    departmentName: "", //传过来员工所在的部门名
    departmentId: '', //员工原先所在部门id
    position: "", //传过来员工所在的部门职务
    //用来显示下拉部门数组
    list: [],
    departmentIndex: 0, //部门下标值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      id: options.id,
      name: options.name,
      departmentName: options.departmentName,
      position: options.position
    });
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success: res => {
        console.log(res);
        let departmentList = res.data.data;
        if (res.data.code == 200) {
          for (let i = 0; i < departmentList.length; i++) {
            var list = {},
              array = that.data.list;
            if (that.data.departmentName == departmentList[i].departmentName) {
              that.setData({
                departmentId: departmentList[i].id
              });
              console.log(that.data.departmentId);
            }
            list["name"] = departmentList[i].departmentName;
            list["value"] = departmentList[i].id;
            array.push(list);
            that.setData({
              list: array
            });
          }
          console.log(that.data.list);
        }
      }
    })
  },
  //部门选择监听器
  bindDepartmentChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      departmentIndex: e.detail.value
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(this.data.list[e.detail.value.department_id].value);
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/department/addMobilize",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        employeeId: that.data.id,
        originalPosition: that.data.position,
        originalDepartmentId: that.data.departmentId,
        nowPosition: e.detail.value.position,
        nowDepartmentId: that.data.list[e.detail.value.department_id].value,
        transferDate: util.formatDate(new Date()),
        transferReason: e.detail.value.transferReason,
        approver: '未设置',
        mobilizeRemark: e.detail.value.mobilizeRemark
      },
      success: function(res) {
        if (res.data.code == 200) {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
          wx.showToast({
            title: '调整岗位成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
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