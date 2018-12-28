//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        grids: ["休假", "加班", "排班", "外勤", "报表", "审批", "入职", "考勤", "公告"],//九宫格具体功能名称
        images: ["/images/qingjia.png", "/images/jiaban.png", "/images/pingjia.png", "/images/waiqin.png", "/images/baobiao.png", "/images/shenpi.png", "/images/ruzhi.png", "/images/kaoqin.png", "/images/pingjia.png"],//九宫格对应icon图标
		urls: ["/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list", "/pages/list/list"],//九宫格功能跳转url
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    check: function() {
        wx.request({
            url: 'http://localhost:8080/role/userOrder',
            success: function(res) {
                console.log(res);
            }
        })
	},
    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
	//每日打卡
	query: function () {
		wx.getLocation({
			success: function(res) {
				console.log(res);
			},
		})
	},
})