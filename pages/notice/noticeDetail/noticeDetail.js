// pages/noticeDetail/noticeDetail.js
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar, //手机状态栏的高度，单位px
    CustomBar: app.globalData.CustomBar, //设定状态栏的高度，单位px
    id:'',//公告id
    noticeDetail: '',//公告内容
    content:'',//评论内容
    discussList:'',//评论列表
    like:false,//该用户是否已点赞
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //公告通知id
    let id = options.id;
    this.setData({
      userInfo:wx.getStorageSync("userInfo"),
      id:id
    });
    this.getNoticeDetail(this,id);  

  },
  //获取公告内容
  getNoticeDetail(self,id){
    wx.request({
      url: app.globalData.baseUrl + "/notice/detail",
      data: {
        id: id
      },
      method: 'GET',
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          let noticeDetail = res.data.data;
          noticeDetail.noticeTime = app.timestamp(noticeDetail.noticeTime, 1);
          self.setData({
            noticeDetail: noticeDetail
          });
          console.log(self.data.noticeDetail);
          self.getDiscuss(self);
          self.checkLike(self);
        }
      }
    });
  },
  //获取用户评论
  content(e){
    this.setData({
      content:e.detail.value
    });
  },
  //增加评论
  addDiscuss(){
    let content=this.data.content,that=this;
    if(content==""||content==null){
      wx.showToast({
        title: '评论为空',
        image:'/images/warning.png',
      })
    }else{
      wx.request({
        url: app.globalData.baseUrl+'/notice/addDiscuss',
        method:'POST',
        data:{
          id: this.data.noticeDetail.id,
          employeeID: this.data.userInfo.userId,
          content:this.data.content,
          discussTime:util.formatDate(new Date()),
          employeeName:this.data.userInfo.name
        },
        success(res){
          if(res.data.code==200){
            that.setData({
              content:''
            });
            that.getDiscuss(that);
            wx.showToast({
              title: '评论成功',
            });
          }
        }
      })
    }
  },
  //获取评论内容
  getDiscuss(that){
    wx.request({
      url: app.globalData.baseUrl+'/notice/getDiscuss',
      data:{
        id: that.data.noticeDetail.id
      },
      success(res){
        if(res.data.code==200){
          let discussList=res.data.data;
          for(let i=0;i<discussList.length;i++){
            discussList[i].discussTime = app.timestamp(discussList[i].discussTime,1);
          }
          that.setData({
            discussList: discussList
          });
        }
      }
    })
  },
  //为文章点赞
  like(){
    wx.showLoading({
      title: '点赞中',
      mask:false
    })
    let that=this;
    wx.request({
      url: app.globalData.baseUrl + '/notice/like',
      data: {
        employeeId: that.data.userInfo.userId,
        articleId: that.data.noticeDetail.id
      },
      method: 'POST',
      success: res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            duration:2000
          });
          that.setData({
            like:true
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
          that.setData({
            like: false
          });
        }
        that.getNoticeDetail(that,that.data.id);
        wx.hideLoading();
      }
    });
  },
  //判断该用户是否已点赞该文章
  checkLike(that){
    wx.request({
      url: app.globalData.baseUrl +'/notice/checkLike',
      data:{
        employeeId: that.data.userInfo.userId,
        articleId: that.data.noticeDetail.id
      },
      method:'POST',
      success:res=>{
        if(res.data.code==200){
          that.setData({
            like: true
          });
        }else{
          that.setData({
            like:false
          });
        }
      }
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