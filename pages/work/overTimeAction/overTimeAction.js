// pages/work/overTimeAction/overTimeAction.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id: '',
    userInfo: '', //登录缓存的用户信息
    startDate: util.formatDate(new Date()), //加班申请开始时间
    endDate: util.formatDate(new Date()), //加班申请结束时间
    startTime: '09:00',
    endTime: '18:00',
    endStartDate: util.formatDate(new Date()),
    departmentList: [], //部门id和名字
    index: 0, //部门选择器开始下标
    overtimeList: '', //未审批的加班列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id,
      userInfo: wx.getStorageSync('userInfo')
    });
    this.getDepartment();
    //默认展示人事部加班审批记录
    this.getNotApprove(1);
  },
  //获取部门信息
  getDepartment() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success(res){
        if (res.data.code == 200) {
          let departmentList = res.data.data;
          for(let i=0;i<departmentList.length;i++){
            departmentList[i].idx=i;
          }
          that.setData({
            departmentList: departmentList
          });
        }
      }
    })
  },
  //获取未审批的加班列表
  getNotApprove(id) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/overtime/getApprove",
      data: {
        id: id
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          let overtimeList = res.data.data;
          for (let i = 0; i < overtimeList.length; i++) {
            var startTime = util.formatTime(new Date(overtimeList[i].startTime));
            var endTime = util.formatTime(new Date(overtimeList[i].endTime));
            startTime = startTime.toLocaleString();
            endTime = endTime.toLocaleString();
            var a=startTime.split("/");
            var b=endTime.split("/");
            overtimeList[i].startTime=(a[0]+"年"+a[1]+"月"+a[2]).replace(" ","日 ");
            overtimeList[i].endTime=(b[0] + "年" + b[1] + "月" + b[2]).replace(" ","日 ");
            that.setData({
              overtimeList: overtimeList
            });
          }
        }else{
          that.setData({
            overtimeList:null
          });
        }
      }
    })
  },
  //开始日期监听
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      endStartDate:e.detail.value
    });
  },
  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  //结束日期监听
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //提交加班申请请求
  submit: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/overtime/addOverTimeRecord',
      data: {
        id: that.data.userInfo.userId,
        departmentId: that.data.userInfo.department_id,
        overTimeReason: e.detail.value.reason,
        startTime: that.data.startDate + " " + that.data.startTime,
        endTime: that.data.endDate + " " + that.data.endTime,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
          wx.showToast({
            title: res.data.data,
            duration: 2000
          });
        }
      }
    });
  },
  //加班记录筛选部门监听器
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
    this.getNotApprove(this.data.departmentList[e.detail.value].id);
  },
  getDeaprtment() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success: res => {
        if (res.data.code == 200) {
          that.setData({
            departmentList: res.data.data
          });
        }
      }
    });
  },
  //同意申请
  agree(e){
    this.addOvertime(e.currentTarget.dataset.id,1);
  },
  //驳回申请
  oppose(e){
    this.addOvertime(e.currentTarget.dataset.id, 0);
  },
  //发起加班通过，驳回请求
  addOvertime(id,status){
    let that=this;
    wx.request({
      url: app.globalData.baseUrl + "/overtime/approve",
      method: 'POST',
      data: {
        overtimeID: id,
        approve: wx.getStorageSync("userInfo").name,
        status: status
      },
      success: res => {
        if(res.data.code==200){
          that.getNotApprove(that.data.departmentList[that.data.index].id);
        }
      }
    });
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