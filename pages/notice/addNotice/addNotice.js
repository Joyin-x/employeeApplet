// pages/addNotice/addNotice.js
const app=getApp();
var util=require('../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},
	//点击提交公告消息
	addSubmit:function(e){
    console.log(util.formatDate(new Date()));
		wx.request({
			url: app.globalData.baseUrl + "/notice/addNotice",
			method: 'POST',
			header: {
				'content-type': 'application/json'
			},
			data: {
        id: wx.getStorageSync("userInfo").userId,
				header: e.detail.value.noticeName,
				content:e.detail.value.noticeContent,
        noticeTime: util.formatDate(new Date())
			},
			success:function(res){
        console.log(res);
				if(res.data.code==200){
					setTimeout(function () {
						wx.navigateBack({
							delta: 1
						})
					}, 2000);
					wx.showToast({
						title: '已发布',
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