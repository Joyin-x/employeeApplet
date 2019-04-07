// pages/my/myInformation/myInformation.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    flag: "", //传过来的标志flag
    navs: ["已完成", "未完成"],
    TabCur: 0,
    scrollLeft: 0,
    do: 0, //完成的任务数量
    notdo: 0, //未完成的数量
    userInfo: '', //登录后存储的用户信息
    info: '', //用户点击不同按钮返回的信息
    photos: '', //修改头像后的路径
    isShow: false,
    newPhone: '',
    idx: 0, //弹框下标
    sex: ['男', '女'],
    index:0,
    endData: util.formatDate(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync("userInfo");
    userInfo.birthday = app.timestamp(userInfo.birthday, 1);
    this.setData({
      flag: options.flag,
      userInfo: userInfo
    });
    if (this.data.flag != 0) {
      this.getInfo(this);
    }

  },
  //导航栏移动（未完成，已完成）
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  //点击图片查看大图
  watchBImg: function() {
    let that = this;
    wx.previewImage({
      urls: [that.data.userInfo.picture],
      current: that.data.userInfo.picture
    });
  },
  //我的操作页面点击不同栏目的操作
  getInfo(that) {
    wx.request({
      url: app.globalData.baseUrl + '/own/getInfo',
      data: {
        id: that.data.userInfo.id,
        flag: that.data.flag,
      },
      success(res) {
        console.log(res);
        if (res.data.code == 200) {
          let info = res.data.data;
          if (that.data.flag == 1) {
            for (let i = 0; i < info.length; i++) {
              info[i].transfer_date = app.timestamp(info[i].transfer_date, 1);
            }
          } else if (that.data.flag == 2) {
            for (let i = 0; i < info.length; i++) {
              info[i].startTime = app.timestamp(info[i].startTime, 1);
              info[i].endTime = app.timestamp(info[i].endTime, 1);
            }
          } else if (that.data.flag == 4) {
            for (let i = 0; i < info.length; i++) {
              if (info[i].status == true) {
                that.setData({
                  do: that.data.do + 1
                });
              } else {
                that.setData({
                  notDo: that.data.notDo + 1
                });
              }
              info[i].start_time = app.timestamp(info[i].start_time, 1);
              info[i].end_time = app.timestamp(info[i].end_time, 1);
            }
          }
          that.setData({
            info: info
          });
        } else {
          that.setData({
            info: null
          });
        }
      }
    })
  },
  //同意申请
  agree(e) {
    this.updateStatus(e.currentTarget.dataset.id);
  },
  //更改任务状态
  updateStatus(id) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + "own/updateTaskStatus",
      method: 'GET',
      data: {
        id: id
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          that.getInfo(that);
        }
      }
    });
  },
  //更改信息
  updateInfo(e) {
    let id = e.currentTarget.dataset.id,
      that = this;
    that.setData({
      idx: id
    });
    if (id == 1) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          that.setData({
            photos: res.tempFilePaths[0],
          });
          wx.showLoading({
            title: '正在修改',
            mask:true
          })
          that.upload(that);
        }
      });
    } else if (id == 2 || id == 5 || id == 6 || id == 7) {
      this.setData({
        isShow: true
      });
    } else if (id == 3) {

    }
  },
  hideModal() {
    this.setData({
      isShow: false
    });
  },
  //提交图片到后台
  upload(that) {
    wx.uploadFile({
      url: app.globalData.baseUrl + '/notice/addImage',
      filePath: that.data.photos,
      name: 'file',
      method: "POST",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        'user': that.data.userInfo.userId
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.code == 200) {
          let picture = data.data;
          let i = picture.lastIndexOf('/');
          picture = "https://weixiong.info/image/" + picture.substring(i + 1);
          let userInfo = that.data.userInfo;
          userInfo.picture = picture;
          that.setData({
            userInfo: userInfo
          });
          wx.setStorageSync("userInfo", that.data.userInfo);
          wx.showToast({
            title: '成功修改',
          })
        } else {
          wx.showToast({
            title: '修改失败',
            image: "/images/warning.png"
          });
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  //获取弹窗的值
  getValue(e) {
    console.log(e);
    this.setData({
      newPhone: e.detail.value
    });
  },
  //点击确认发送请求
  confirm() {
    let that = this;
    console.log(that.data.idx);
    wx.request({
      url: app.globalData.baseUrl + '/own/updateInfo',
      data: {
        info: that.data.newPhone,
        flag: that.data.idx,
        id: that.data.userInfo.userId
      },
      success: res => {
        if (res.data.code == 200) {
          wx,
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#00c8fa',
          })
          let userInfo = that.data.userInfo;
          if (that.data.idx == 2) {
            userInfo.phone = that.data.newPhone;
          } else if (that.data.idx == 3) {
            userInfo.sex = that.data.newPhone;
          }else if(that.data.idx==4){
            userInfo.birthday=that.data.newPhone;
          } 
          else if (that.data.idx == 5) {
            userInfo.address = that.data.newPhone;
          } else if (that.data.idx == 6) {
            userInfo.school = that.data.newPhone;
          } else if (that.data.idx == 7) {
            userInfo.professional = that.data.newPhone;
          }
          that.setData({
            userInfo: userInfo,
          });
          wx.setStorageSync("userInfo", userInfo)
        }
        else {
          wx,
          wx.showModal({
            title: '警告',
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#00c8fa',
          })
        }
        that.setData({
          isShow: false
        });
      }
    })
  },
  sexChange(e) {
    console.log(e.detail.value);
    this.setData({
      newPhone: e.detail.value
    });
    this.confirm();
  },
  //生日修改监听
  dateChange(e) {
    this.setData({
      newPhone: e.detail.value
    });
    this.confirm();
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