//app.js

App({
    onLaunch: function() {
        let that = this;
        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let custom = wx.getMenuButtonBoundingClientRect();
                this.globalData.Custom = custom;
                this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            }
        });
        this.getDepartment(this);
    },
    //获取部门信息
    getDepartment(that) {
        wx.request({
            url: that.globalData.baseUrl + "/department/getDepartmentAndId",
            success(res) {
                if (res.data.code == 200) {
                    let departmentList = res.data.data;
                    that.globalData.departmentList = departmentList;
                }
            }
        });

    },
    //获取人事部id
    getDepartmentID() {
        let id = 0,
            list = this.globalData.departmentList;
        for (let i = 0; i < list.length; i++) {
            if (list[i].departmentName == "人事部") {
                id = list[i].id;
                break;
            }
        }
        return id;
    },
    //获取财务部id
    getDepartmentID1() {
        let id = 0,
            list = this.globalData.departmentList;
        console.log(list);
        for (let i = 0; i < list.length; i++) {
            if (list[i].departmentName == "财务部") {
                id = list[i].id;
                break;
            }
        }
        return id;
    },
    requestPost: function(url, data) {
        return new Promise((resolve, reject) => {
            //初始化
            var that = this;
            var postData = data;
            //网络请求
            wx.request({
                url: url,
                data: postData,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) { //服务器返回数据
                    if (res.data.code == 200) {
                        resolve(res.data.data);
                    } else { //返回错误提示信息
                        reject(res.data.msg);
                    }
                },
                error: function(e) {
                    reject('网络出错');
                }
            })
        });
    },
    requestGet: function(url, data) {
        return new Promise((resolve, reject) => {
            //初始化
            var that = this;
            var getData = data;
            //网络请求
            wx.request({
                url: url,
                data: getData,
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) { //服务器返回数据
                    console.log(res);
                    if (res.data.code == 200) {
                        resolve(res.data.data);
                    } else { //返回错误提示信息
                        reject(res.data.msg);
                    }
                },
                error: function(e) {
                    reject('网络出错');
                }
            })
        });
    },
    //登录验证
    checkLogin: function() {
        var that = this;
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求

                    wx.request({
                        url: that.globalData.baseUrl + '/returnUUID',
                        data: {
                            code: res.code
                        },
                        success(response) {
                            that.globalData.uuid = response.data.data;
                            that.getSession();
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    getSession() {
        let that = this;
        wx.request({
            url: that.globalData.baseUrl + '/checkCUUID',
            data: {
                uuid: that.globalData.uuid
            },
            success(response) {}
        })
    },

    //http://localhost:8080/ssmstart_war/
    //https://weixiong.info
    globalData: {
		baseUrl: 'http://localhost:8080/ssmstart_war/',
        url: null,
        uuid: ''
    }
})