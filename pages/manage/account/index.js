// pages/manage/account/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let username = wx.getStorageSync('username');
    this.setData({
      username
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

  changePassword() {
    wx.navigateTo({
      url: './passwordchange',
    })
  },


  loginOut() {
    wx.showModal({
      content: '确认退出当前账号嘛?',
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.reLaunch({
            url: '../../login/login',
          });
        } else if (res.cancel) {}
      }
    })
  }
})