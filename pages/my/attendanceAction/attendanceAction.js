// pages/my/attendanceAction/attendanceAction.js
const app = getApp();
var QQMapWX = require('..//../../utils/qqmap-wx-jssdk.js');
var util = require('../../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    flag: '', //传过来的命令下标
    location: '', //获取当前所在地点
    departmentList: [], //部门id和名字
    attendanceList: "", //打卡记录
    index: 0, //部门选择器开始下标
    rankList: "" //打卡排行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取地理位置信息
    this.getLocation();
    this.setData({
      flag: options.id,
    });
    //获取部门id信息
    this.getDepartment();
    //根据部门id获取打卡记录信息
    this.getAttendanceById(1);
    //获取打卡排行
    this.getRanklist();
  },
  //上班打卡签到
  addStart() {
    let that = this;
    let newdate = util.formatTime(new Date());
    wx.request({
      url: app.globalData.baseUrl + 'overtime/addAttendance',
      data: {
        employeeID: wx.getStorageSync('userInfo').userId,
        officeTime: newdate,
        location: that.data.address,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          wx.setStorageSync("isAttendance", true);
          wx.showToast({
            title: '下班别忘了打卡！',
            duration: 2000
          })
        } else if (res.data.code == 411) {
          wx.showToast({
            title: '上午已打卡',
            image: '/images/warning.png'
          });
        }
      }
    });
  },
  //下班打卡签到
  addEnd() {
    let newdate = util.formatTime(new Date());
    console.log(newdate);
    wx.request({
      url: app.globalData.baseUrl + 'overtime/updateAttendance',
      data: {
        id: wx.getStorageSync('userInfo').userId,
        afterWork: newdate,
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '下班打卡成功',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/images/warning.png'
          });
        }
      }
    });

  },
  //获取当前考勤地点
  getLocation() {
    var that = this
    wx.getLocation({ //调用API得到经纬度
      type: 'gcj02',
      success: function(res) {
        var speed = res.speed
        var accuracy = res.accuracy
        var latitude = res.latitude
        var longitude = res.longitude

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //地址解析
        var demo = new QQMapWX({
          key: 'XIOBZ-RONKK-EZOJP-AJOJY-NH4MK-HGBUQ' // 这个KEY的获取方式在上面链接 腾讯位置服务的开发文档中有详细的申请密钥步骤
        });

        demo.reverseGeocoder({ //地址解析
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log(res);
            //获得地址
            that.setData({
              address: res.result.address
            })
          }
        });
      }

    })
  },
  //获取部门信息
  getDepartment() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success(res) {
        if (res.data.code == 200) {
          let departmentList = res.data.data;
          for (let i = 0; i < departmentList.length; i++) {
            departmentList[i].idx = i;
          }
          that.setData({
            departmentList: departmentList
          });
        }
      }
    })
  },
  //按部门获取打卡记录
  getAttendanceById(id) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'overtime/getAttendanceById',
      data: {
        id: id
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          let attendanceList = res.data.data;
          console.log(attendanceList);
          for (let i = 0; i < attendanceList.length; i++) {
            if (attendanceList[i].office_time != null){
              attendanceList[i].office_time = app.timestamp(attendanceList[i].office_time,0);
            }
            if (attendanceList[i].after_work!=null){
              attendanceList[i].after_work = app.timestamp(attendanceList[i].after_work, 0);
            }
          }
          that.setData({
            attendanceList: attendanceList
          });
        } else {
          that.setData({
            attendanceList: null
          })
        }
      }
    })
  },
  //获取打卡排名列表
  getRanklist() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + 'overtime/getRankList',
      success(res) {
        if (res.data.code == 200) {
          let rankList = res.data.data;
          for (let i = 0; i < rankList.length; i++) {
            if (rankList[i].office_time != null) {
              rankList[i].office_time = app.timestamp(rankList[i].office_time, 0);
            }
            if (rankList[i].after_work != null) {
              rankList[i].after_work = app.timestamp(rankList[i].after_work, 0);
            }
          }
          that.setData({
            rankList: rankList
          });
        }
      }
    })
  },
  //打卡记录筛选监听器
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
    this.getAttendanceById(this.data.departmentList[e.detail.value].id);
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