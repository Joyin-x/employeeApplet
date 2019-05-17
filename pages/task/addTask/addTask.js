// pages/addTask/addTask.js
const app=getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,//手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar,//设定状态栏的高度，单位px
    id:'',//员工id
    name:'',//员工姓名
    departmentName:'',//部门名
    position:'',//职务
    startDate: util.formatDate(new Date()),
    endDate: util.formatDate(new Date()),
    endStartDate: util.formatDate(new Date()),//截止开始时间
    status: [{
      name: '已完成',
      value: '0',
    }, {
        name: '待完成',
        value: '1',
        checked: 'true'
      }],
    statusIndex:1,
  },
  bindStatusChange(e){
    this.setData({
      statusIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      name:options.name,
      departmentName: options.departmentName,
      position: options.position
    });
  },
  //起始时间选择监听器
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      endStartDate:e.detail.value
    })
  },
  //截止时间选择监听器
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  //表单提交
  formSubmit(e) {
    this.addTask(e.detail.value);
  },
  //提交指派任务
  addTask:function(task){
    if (task.taskContent == null || task.taskContent == "") {
      wx.showToast({
        title: '指派工作为空',
        image: '/images/warning.png'
      });
      return;
    }
    wx.request({
      url: app.globalData.baseUrl + '/mobilize/addTask',
      data: {
        employeeId: this.data.id,
        workContent: task.taskContent,
        status: this.data.status[this.data.statusIndex].value,
        startTime: task.startDate,
        endTime: task.endDate,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res);
        if(res.data.code==200){
          setTimeout(function () {
            wx.navigateBack({
              delta: -1
            })
          }, 2000);
          wx.showToast({
            title: '指派成功',
            icon:'success',duration:2000
          });
        }
        else{
          wx.showToast({
            title: '失败',
            image:'/images/warning.png'
          })
        }
      }
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