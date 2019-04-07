// pages/employeeList/employeeList.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    TabCur: 0, //左侧标签栏下标
    VerticalNavTop: 0, //右侧文本区下标
    tabs: ["员工信息", "员工入职"],
    departmentId: 0,
    departmentList: [{
      name: '所有部门',
      value: '0',
      checked: 'true'
    },],

    sex: [{
      name: 0,
      value: '男',
      checked: false
    }, {
      name: 1,
      value: '女',
      checked: true
    }],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    list: '',
    isShow: false,
    date: '2016-09-01',
    region: ['广东省', '广州市', '天河区'], //存储籍贯值
    array: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
    index: 0, //学历下标值
    department: [], //后台返回的部门和对应的id号
    departmentIndex: 0, //部门下标值
    gradeIndex:0,
    grade:[{
      name: '普通员工',
      value: '0',
      checked: 'true'
    },{
        name: '部门经理',
        value: '1',
    },
    {
      name: '超级管理员',
      value: '2',
    }],
  },
  onLoad: function() {
    //判断用户权限
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    let userInfo = this.data.userInfo,
      that = this;
    if (userInfo.flag == 0) {
      wx.showModal({
        title: '警告',
        content: userInfo.name + ',你的职位为' + userInfo.position + ',没有权限管理员工！',
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
    //获取所有部门的员工信息
    this.getEmployeeList(this);
    // 获取顶部导航滑块的长度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    });
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success: res => {
        let departmentList = res.data.data;
        if (res.data.code == 200) {
          for (let i = 0; i < departmentList.length; i++) {
            var list = {},
              array = that.data.department,
              array1 = that.data.departmentList;
            list["name"] = departmentList[i].departmentName;
            list["value"] = departmentList[i].id;
            array.push(list);
            array1.push(list);
            that.setData({
              department: array,
              departmentList: array1
            });
          }
        }
      }
    })
  },
  //左侧标签栏下标改变
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //获取所有部门员工的的信息
  getEmployeeList(that) {
    wx.request({
      url: app.globalData.baseUrl + '/department/getDepartmentEmployee',
      data: {
        id: that.data.departmentId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data,
            isShow: false,
          });
        } else {
          that.setData({
            list: null,
            isShow: true
          });
        }
      }
    });
  },
  //监听男女按钮选择器
  sexChange(e) {
  },
  //出生日期选择监听器
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 监听选择查看部门的改变
  radioChange(e) {
    this.setData({
      departmentId: e.detail.value
    });
    this.getEmployeeList();
  },
  //籍贯选择监听器
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //学历选择监听器
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //部门选择监听器
  bindDepartmentChange: function(e) {
    this.setData({
      departmentIndex: e.detail.value
    })
  }, 
   //部门选择监听器
  bindGradeChange: function(e) {
    this.setData({
      gradeIndex: e.detail.value
    })
  },
  //表单提交
  formSubmit(e) {
    let item = e.detail.value,
      that = this;
    item.native_place = item.native_place[0] + item.native_place[1] + item.native_place[2];
    if (item.name==""){
      wx.showToast({
        title: '',
      })
    }
    wx.request({
      url: app.globalData.baseUrl + '/employee/addEmployee',
      data: {
        name: item.name,
        sex: item.sex,
        birthday: item.birthday,
        native_place: item.native_place,
        address: item.address,
        phone: item.phone,
        department_id: that.data.department[item.department_id].value,
        education: item.education,
        school: item.school,
        email: item.email,
        remark: item.remark,
        flag:item.grade,
        position:item.position,
        professional: item.professional
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: "添加员工信息成功，默认登录密码已发送到填写的邮箱，请尽快通知员工登录更改密码",
            showCancel: false,
            confirmColor: '#00c8fa',
            success(response) {
              if (response.confirm) {
                wx.navigateBack({
                  delta:1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmColor: '#00c8fa',
          })
        }
      }
    })
  },
  //点击跳转到员工个人信息详情页面
  toEmployeeDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/employee/employeeDetail/employeeDetail?id=' + id
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
    this.getEmployeeList(this);
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

  },
})