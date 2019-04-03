//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var qqmapsdk;
Page({
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    latitude: null, //经纬度
    longitude: null,
    address: null, //地址
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    //九宫格对应九个icon
    iconList: [{
        icon: 'post',
        color: 'red',
        badge: 120,
        name: '任务指派'
      }, {
        icon: 'time',
        color: 'orange',
        badge: 1,
        name: '加班'
      }, {
        icon: 'sort',
        color: 'yellow',
        badge: 0,
        name: '工作调动记录'
      },
      {
        icon: 'activity',
        color: 'blue',
        badge: 0,
        name: '部门管理'
      }, {
        icon: 'group',
        color: 'purple',
        badge: 0,
        name: '职员管理'
      }, {
        icon: 'location',
        color: 'mauve',
        badge: 0,
        name: '考勤管理'
      },{
        icon: 'mail',
        color: 'purple',
        badge: 0,
        name: '公告通知'
      }, {
        icon: 'moneybag',
        color: 'yellow',
        badge: 0,
        name: '工资管理'
      }
    ],
    //九宫格具体功能名称
    grids: ["任务指派", "加班申请", "工作调动记录", "外勤", "工资报表", "部门管理", "职员管理", "考勤管理", "公告通知"],
    // "外勤", "工资报表",
    urls: ["/pages/task/home/home", "/pages/work/overTime/overTime", "/pages/jobTransfer/jobTransferRecord/jobTransferRecord", "/pages/department/departmentList/departmentList", "/pages/employee/employeeList/employeeList", "/pages/my/attendance/attendance", "/pages/notice/noticeList/noticeList","/pages/work/money/money"], //九宫格功能跳转url
  },
  onLoad: function() {
    let user=wx.getStorageSync("userInfo");
    console.log(user);
    if(!user){
      wx.navigateTo({
        url: '/pages/my/login/login',
      })
    }
  },
})