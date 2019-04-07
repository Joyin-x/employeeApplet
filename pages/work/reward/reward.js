// pages/work/reward/reward.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id:'',//员工id
    name:'',//员工姓名
    departmentName:'',//部门名
    position:'',//职务名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      name:options.name,
      departmentName:options.department,
      position:options.position
    });
  },
  submit: function (e) {
    let money=e.detail.value.money,
      reason = e.detail.value.reason,
      that=this;
      if(money==""){
        wx.showToast({
          title: '请填写奖惩金额',
          image:'/images/warning.png'
        });
        return;
      }else if(reason==""){
        wx.showToast({
          title: '请填写奖惩原因',
          image:'/images/warning.png'
        });
        return;
      }
      wx.request({
        url: app.globalData.baseUrl +'/money/addReward',
        method:'POST',
        data:{
          employeeId:that.data.id,
          rewardsDate:util.formatDate(new Date()),
          money:money,
          rewardsReason:reason,
        },
        success:res=>{
          console.log(res);
          if(res.data.code==200){
            wx.showToast({
              title:'已添加',
              mask:true,
              duration:2000
            });
          }else{
            wx.showToast({
              title: '添加失败',
              image:'/images/warning.png',
            })
          }
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }
      })
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