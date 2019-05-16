// pages/login/login.js

//获取应用实例
const app = getApp();


import {
  getLocal,
  setLocal
} from '../../utils/local';

import config from '../../config.js';
const BASE_URL = config.BASE_URL;
import base64 from '../../lib/js/base64.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    username: '',
    password: '',

    isPlease: false,
    tip: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getWXuserinfo()
  },

  /**
   * 获取微信用户信息
   */
  getWXuserinfo: function() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  usernameChange(e) {
    this.setData({
      username: e.detail.value
    })
  },


  passwordChange(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 登录
   */
  handleClick() {

    if (!this.data.username) {
      this.setData({
        isPlease: true,
        tip: '请输入用户名'
      })
      return false;
    }

    if (!this.data.password) {
      this.setData({
        isPlease: true,
        tip: '请输入密码'
      })
      return false;
    }


    this.setData({
      isPlease: false
    })

    wx.showLoading({
      title: '',
    })

    let Authorization = base64.CusBASE64.encoder(`${config.client_id}:${config.client_secret}`);

    wx.request({
      url: BASE_URL + "/oauth/token",
      method: "post",
      data: {
        username: this.data.username,
        password: this.data.password,
        grant_type: config.grant_type
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Authorization}`
      },
      success: res => {
        if (res.data.access_token) {
          let expireTime = new Date().valueOf() + res.data.expires_in * 1000;
          res.data.expireTime = expireTime;
          try {
            app.globalData.token = res.data;
            wx.setStorageSync('tokenInfo', res.data);
            wx.setStorageSync('username', this.data.username);
            setTimeout(() => {
              wx.reLaunch({
                url: '../index/index',
              })
            }, 500)

          } catch (err) {
            console.error(err);
          }

        } else {
          wx.hideLoading()
          this.setData({
            isPlease: true,
            tip: '账号或密码错误'
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        console.error(error);
        this.setData({
          isPlease: true,
          tip: '用户名或密码错误'
        })
      }
    })





  }

})