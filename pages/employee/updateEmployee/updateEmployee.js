// pages/employee/updateEmployee/updateEmployee.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    ColorList: app.globalData.ColorList,
    list:'',//要修改的用户原来的信息
    sex: [{
      name: 0,
      value: '男',
      checked: false
    }, {
      name: 1,
      value: '女',
      checked: true
    }],
    date: '2016-09-01',
    region: ['广东省', '广州市', '天河区'],
    departmentIndex: 0, //部门下标值
    department: [],
    grade: [{
        name: '普通员工',
        value: '0',
        checked: 'true'
      }, {
        name: '部门经理',
        value: '1',
      },
      {
        name: '超级管理员',
        value: '2',
      }
    ],
    gradeIndex: 0,
    array: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
    index: 0, //学历下标值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let list = JSON.parse(options.list),
      array = this.data.array,
      region = [];
    console.log(list);
    region.push(list.native_place);
    this.setData({
      list: list,
      gradeIndex: list.flag,
      region: region,
      date:list.birthday
    });
    for (let i = 0; i < array.length; i++) {
      if (array[i] == list.education) {
        this.setData({
          index: i
        });
        break;
      }
    }
    this.getDepartment(this);
  },
  //获取部门编号
  getDepartment(that) {
    wx.request({
      url: app.globalData.baseUrl + "/department/getDepartmentAndId",
      success: res => {
        let departmentList = res.data.data;
        if (res.data.code == 200) {
          for (let i = 0; i < departmentList.length; i++) {
            var list = {},
              array = that.data.department;
            list["name"] = departmentList[i].departmentName;
            list["value"] = departmentList[i].id;
            array.push(list);
            that.setData({
              department: array,
            });
          }
          for (let i = 0; i < that.data.department.length; i++) {
            if (that.data.department[i].value == this.data.list.department_id) {
              that.setData({
                departmentIndex: i
              });
              break;
            }
          }
        }
      }
    })
  },
  //出生日期选择监听器
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //籍贯选择监听器
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //部门选择监听器
  bindDepartmentChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      departmentIndex: e.detail.value
    })
  },
  bindGradeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gradeIndex: e.detail.value
    })
  },
  //表单提交
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let item = e.detail.value,
      that = this;
    if (item.native_place.length==1){
      item.native_place=item.native_place[0];
    }
    else{
      item.native_place = item.native_place[0] + item.native_place[1] + item.native_place[2];
    }
    wx.request({
      url: app.globalData.baseUrl + '/employee/updateEmployee',
      data: {
        id: that.data.list.id,
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
        flag: item.grade,
        position: item.position,
        professional: item.professional
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          setTimeout(function(){
            wx.navigateBack({
              delta: 2
            });
          }, 2000);
          wx.showToast({
            title: '修改成功',
            duration:2000
          });
        }
      }
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