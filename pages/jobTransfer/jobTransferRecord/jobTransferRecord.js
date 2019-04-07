// pages/jobTransferRecord/jobTransferRecord.js
const app=getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    StatusBar: app.globalData.StatusBar,//手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar,//设定状态栏的高度，单位px
    mobilizeList:[],//返回的员工个人岗位调整记录
    userInfo:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    let userInfo=this.data.userInfo;
    if(userInfo.flag==0){
      wx.showModal({
        title: '警告',
        content: userInfo.name + ',你的职位为' + userInfo.position + ',没有权限查看工作调动记录！',
        showCancel: false,
        confirmText: "返回",
        confirmColor: "#00BFFF",
        success: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      });
      return;
    }
    //获取员工岗位调整记录
    this.getMobilizeWithName();
	},
  //返回员工的岗位调整记录数
  getMobilizeWithName(){
    let that=this;
    wx.request({
      url: app.globalData.baseUrl + '/mobilize/getMobilizeWithName',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            mobilizeList: res.data.data
          });
        }
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
    this.getMobilizeWithName();
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