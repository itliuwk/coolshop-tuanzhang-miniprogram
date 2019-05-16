import {
  getLocal,
  setLocal
} from '../../utils/local';
// pages/grant/grant.js
import {
  MyMapObject
} from '../../utils/lodash';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url = options.url
    var options_url = getLocal('cache_options_url')
    this.setData({
      url: url + "?" + options_url || '/pages/index/index'
    })
  },


  userInfoHandler: function(e) {
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showToast({
        title: '部分功能暂不可用！',
        icon: 'none'
      });
    } else {
      app.globalData.userInfo = e.detail.userInfo;
      setLocal("userInfo", e.detail.userInfo);
      wx.reLaunch({
        url: '../login/login',
      });
    }

  }
})