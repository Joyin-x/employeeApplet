// pages/work/money/money.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
        CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
        userInfo: '', //用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getInfo();
        let id = app.getDepartmentID1();
		console.log(id);
        if (this.data.userInfo.flag != 2) {
            if (id != this.data.userInfo.department_id) {
                wx.showModal({
                    title: '警告',
                    content: this.data.userInfo.name + ',你的部门为' + this.data.userInfo.department_name + ',权限不足',
                    showCancel: false,
                    confirmText: "返回",
                    confirmColor: "#00BFFF",
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                });
            }
        }
    },
    //获取用户信息
    getInfo() {
        let userInfo = wx.getStorageSync("userInfo");
        this.setData({
            userInfo: userInfo
        });
        if (userInfo.flag == 0) {
            wx.showModal({
                title: '警告',
                content: userInfo.name + ',你的职位为' + userInfo.position + ',权限不足',
                showCancel: false,
                confirmText: "返回",
                confirmColor: "#00BFFF",
                success: res => {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            });
        }
    },
    //跳转到工资管理的操作界面
    doAction(e) {
        let flag = e.currentTarget.dataset.flag;
        let userInfo = this.data.userInfo;
        wx.navigateTo({
            url: '/pages/work/moneyAction/moneyAction?flag=' + flag,
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