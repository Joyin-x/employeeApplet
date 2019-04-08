// pages/work/money/moneyAction.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
        CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
        flag: '',
        departmentList: [], //部门列表
        index: 0, //部门选择器默认下标
        wageList: '', //工资列表
        employeeList: '', //部门员工列表
        moneyList: '',
        salary: '', //底薪
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
            mask: true,
        })
        let flag = options.flag;
        this.setData({
            flag: flag
        });
        this.getDepartment();
    },
    //获取部门信息
    getDepartment() {
        let that = this,
            flag = that.data.flag;
        wx.request({
            url: app.globalData.baseUrl + "/department/getDepartmentAndId",
            success(res) {
                console.log(res);
                if (res.data.code == 200) {
                    let departmentList = res.data.data;
                    for (let i = 0; i < departmentList.length; i++) {
                        departmentList[i].idx = i;
                    }
                    that.setData({
                        departmentList: departmentList
                    });
                    wx.hideLoading();
                    if (flag == 0) {
                        that.getWagesList(that, 0);
                    } else if (flag == 1 || flag == 3) {
                        that.getemployeeList(that, 0);
                    } else if (flag == 2) {
                        that.getBasicSalary(that, 0);
                    }
                }
            }
        })
    },
    //监听工资发放选择器
    bindWagesChange(e) {
        this.setData({
            index: e.detail.value
        });
        //获取工资发放列表
        this.getWagesList(this, e.detail.value);
    },
    //监听部门底薪选择器
    bindPickerChange(e) {
        this.setData({
            index: e.detail.value
        });
        this.getBasicSalary(this, e.detail.value);
    },
    //获取工资列表
    getWagesList(that, departmentId) {
        let id = that.data.departmentList[departmentId].id;
        wx.request({
            url: app.globalData.baseUrl + "/money/payMoney",
            data: {
                id: id
            },
            success(res) {
                if (res.data.code == 412) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        confirmText: '去查看',
                        confirmColor: '#1E90FF'
                    });
                } else {
                    wx.showToast({
                        title: '发放成功',
                        mask: true
                    })
                }
                let wageList = res.data.data;
                for (let i = 0; i < wageList.length; i++) {
                    wageList[i].start_time = util.formatDate(new Date(wageList[i].start_time));
                    wageList[i].end_time = util.formatDate(new Date(wageList[i].end_time));
                    wageList[i].pay_date = util.formatDate(new Date(wageList[i].pay_date));
                }
                that.setData({
                    wageList: res.data.data
                });

            }
        })
    },
    //出勤统计监听器
    bindRewardsChange(e) {
        this.setData({
            index: e.detail.value
        });
        this.getemployeeList(this, e.detail.value)
    },
    //获取员工出勤天数数据
    getemployeeList(that, index) {
        let id = that.data.departmentList[index].id;
        wx.request({
            url: app.globalData.baseUrl + "/department/getDepartmentEmployee",
            data: {
                id: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success(res) {
				console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        employeeList: res.data.data
                    });
                }
            }
        })
    },
    //获取部门底薪信息
    getBasicSalary(that, index) {
        let id = that.data.departmentList[index].id;
        wx.request({
            url: app.globalData.baseUrl + "/money/selectDepartment",
            data: {
                id: id
            },
            success(res) {
                console.log(res);
                if (res.data.code == 200) {
                    let moneyList = res.data.data;
                    moneyList.established_time = util.formatDate(new Date(moneyList.established_time));
                    that.setData({
                        moneyList: moneyList,
                        salary: moneyList.basic_salary
                    });
                }
            }
        })
    },
    //获取出勤天数
    getAttendance(e) {
        let that = this,
            id = e.currentTarget.dataset.id;
        wx.request({
            url: app.globalData.baseUrl + "/money/countAttendance",
            data: {
                id: id
            },
            success(res) {
                if (res.data.code == 200) {
                    wx.showModal({
                        title: '提示',
                        content: '已出勤' + res.data.data + '天',
                        showCancel: false,
                        confirmColor: '#1E90FF'
                    })
                }
            }
        })
    },
    //底薪监听
    basiceSalary(e) {
        let value = e.detail.value;
        this.setData({
            salary: e.detail.value
        });
    },
    //设置底薪
    setBasicSalary(e) {
        let that = this;
        if (that.data.salary == "" || that.data.salary == null) {
            wx.showToast({
                title: '底薪不能为空！',
                mask: true,
                image: '/images/warning.png'
            });
            return;
        }
        wx.request({
            url: app.globalData.baseUrl + "/money/updateBasicSalary",
            method: 'POST',
            data: {
                id: that.data.moneyList.id,
                basicSalary: that.data.salary,
            },
            success(res) {
                console.log(res);
                if (res.data.code == 200) {
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2000);
                    wx.showToast({
                        title: '成功修改',
                        duration: 2000,
                    });
                }
            }
        })
    },
    toReward(e) {
        let id = e.currentTarget.dataset.id,
            position = e.currentTarget.dataset.position,
            department = e.currentTarget.dataset.department,
            name = e.currentTarget.dataset.name;
			wx.navigateTo({
				url: '/pages/work/reward/reward?id='+id+'&position='+position+'&name='+name+'&department='+department,
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