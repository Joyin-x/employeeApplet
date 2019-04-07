// pages/jobTransferList/jobTransferList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id: '', //传过来的员工id
    list: [], //员工个人岗位调动记录
    departmentList: [], //部门名和id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
    this.getDepartmentList();
    this.getMobilizeWithId();
  },
  //根据员工id查找该员工岗位调动记录
  getMobilizeWithId() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/mobilize/list',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code = 200) {
          let department = that.data.departmentList,
            list = res.data.data;
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < department.length; j++) {
              if (list[i].originalDepartmentId == department[j].id) {
                list[i].originalDepartmentId = department[j].departmentName;
              }
              if (list[i].nowDepartmentId == department[j].id) {
                list[i].nowDepartmentId = department[j].departmentName;
              }
            }
          }
          that.setData({
            list: list
          });
        }
      }
    })
  },
  //获取部门名和对应的id号
  getDepartmentList: function() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/department/list',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            departmentList: res.data.data
          });
        }
      }
    })
  },
  //删除员工调动记录
  deleteMobilize(e){
    let id = e.target.dataset.id,that=this;
    wx.request({
      url: app.globalData.baseUrl+'/mobilize/deleteMobilize',
      data:{
        id:id
      },
      success(res){
        if(res.data.code==200){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },2000);
          wx.showToast({
            title:res.data.msg,
          });
        }else{
          wx.showToast({
            title: res.data.msg,
            image:'/images/warning.png'
          })
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