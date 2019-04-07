// pages/departmentAction/departmentAction.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id: '', //判断部门操作的多个列
    departmentList: '', //部门信息
    showModify: false, //是否显示修改页面
    departmentId: '', //需要修改信息的部门的id
    inputShowed: false, //是否显示搜索输入框
    inputVal: "", //搜索框输入内容
    list: '', //所有员工部门信息
    principal: [], //新增部门的负责人列表
    principalIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getEmployeeList();
    that.setData({
      id: options.id
    });
    if (options.id == 0) {
      this.getSimpleEmployee(this);
    } else if (options.id == 1) {
      this.getDepaermentInfo(this);
    } else {
      this.getDepaermentInfo(this);
    }
  },
  //查询部门负责人和部门id
  getDepaermentInfo(that) {
    wx.request({
      url: app.globalData.baseUrl + "/department/list",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            departmentList: res.data.data
          });
        }
      }
    });
  },
  //请求获取到的普通员工姓名id
  getSimpleEmployee(that) {
    wx.request({
      url: app.globalData.baseUrl + '/department/getSimpleEmployee',
      data: {

      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            principal: res.data.data
          });
        }
      }
    })
  },
  //获取所有部门员工的的信息
  getEmployeeList() {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/department/getDepartmentEmployee',
      data: {
        id: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res);
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
  //根据搜索框输入的文字获取员工部门职务信息
  searchEmployee: function() {
    let that = this;
    if (that.data.inputVal != null) {
      wx.request({
        url: app.globalData.baseUrl + '/department/searchDepartment',
        data: {
          text: that.data.inputVal
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res);
          if (res.data.code == 200) {
            that.setData({
              list: res.data.data,
            });
          }
        }
      })
    }
  },
  //增加部门确定按钮
  addSubmit: function(e) {
    let that = this, principalIndex=this.data.principalIndex;
    wx.request({
      url: app.globalData.baseUrl + "/department/addDepartment",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        employeeId:that.data.principal[principalIndex].id,
        departmentName: e.detail.value.departmentName,
        principal: that.data.principal[principalIndex].name,
        establishedTime: util.formatDate(new Date()),
        position: e.detail.value.position,
        description: e.detail.value.description,
      },
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            duration:2000
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }else{
          wx.showToast({
            title: res.data.msg,
            image:'images/warning.png'
          })
        }

      }
    });
  },
  //修改部门确定按钮
  modifySubmit: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "/department/modifyDepartment",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: that.data.departmentId,
        departmentName: e.detail.value.modifyName,
        principal: e.detail.value.modifyPrincipal
      },
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg
          });
          setTimeout(function() {
            that.data.showModify = false;
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
        }
      }
    });
  },
  //点击进入修改部门
  modify: function(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      departmentId: id,
      showModify: true
    });
  },
  //删除选中部门
  delete: function(e) {
    let id = e.currentTarget.dataset.id,
      departmentName = e.currentTarget.dataset.name;
    wx.showModal({
      title: '删除部门',
      content: '是否确定删除' + departmentName + '，该部门的所有员工信息也将全部删除？',
      confirmColor: '#00c8fa',
      confirmText: '删除',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.baseUrl + "/department/deleteDepartment",
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              id: id,
            },
            success: res => {
              console.log(res);
              if (res.data.code == 200) {
                wx.showToast({
                  title: res.data.msg
                });
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 2000);
              }
            }
          });
        }
      }
    })
  },
  //点击选择部门负责人
  bindprincipalChange(e){
    let idx = e.detail.value;
    this.setData({
      principalIndex:idx
    });
  },
  //点击跳转到工作调动页面
  toEmployeeDetail: function(e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      departmentName = e.currentTarget.dataset.departmentname,
      position = e.currentTarget.dataset.position;
    wx.navigateTo({
      url: '/pages/jobTransfer/jobTransferAction/jobTransferAction?id=' + id + '&name=' + name + '&departmentName=' + departmentName + '&position=' + position
    })
  },
  //显示搜索输入框
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  //隐藏搜索输入框
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  //清除搜索输入框内容
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  //设置搜索输入框内容
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.searchEmployee();
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
    this.getEmployeeList();
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