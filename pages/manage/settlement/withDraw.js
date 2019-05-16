// pages/me/withDraw/withDraw.js
import fetch from '../../../lib/fetch.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authBtnText: '获取验证码',
    restGetAuthCodeTime: 60,
    getAuthCodeTimer: null,
    ways: ['微信钱包'],
    wayIndex: 0,
    isDisabled: false,
    withDrawInfo: {
      balance: '0.00'
    },

    tips: "请输入正确信息",
    showTopTips: false,

    withDrawLoading: false,

    withDrawParams: {
      amount: null,
      key: 'agent',
      code: null,
      mobile: null
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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

  },


  getOathcode: function() {
    if (!this.data.withDrawInfo.mobile) {
      this.setData({
        tips: '请输入手机号码'
      })
    }
    if (this.data.getAuthCodeTimer) return;
    let restTime = this.data.restGetAuthCodeTime;
    let timer = setInterval(() => {
      restTime--;
      if (restTime != 0) {
        this.setData({
          authBtnText: restTime + 's',
        });
      } else {
        clearInterval(this.data.getAuthCodeTimer);
        this.setData({
          getAuthCodeTimer: null,
          authBtnText: '获取验证码'
        });
      }
    }, 1000);
    this.setData({
      getAuthCodeTimer: timer
    });
    fetch({
        url: `/settlement/withdraw`,
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          mobile: this.data.withDrawInfo.mobile
        }
      })
      .then(res => {
        wx.showToast({
          title: '验证码已发送',
        })
      })
      .catch(err => {
        console.log(err);
      })
  },

  withDrawAmountHandle: function(e) {
    let that = this
    this.setData({
      showTopTips: false,
      withDrawParams: Object.assign({}, this.data.withDrawParams, {
        amount: e.detail.value
      })
    })
  },

  authCodeHandle: function(e) {
    this.setData({
      showTopTips: false,
      withDrawParams: Object.assign({}, this.data.withDrawParams, {
        code: e.detail.value
      })
    })
  },


  confirmWithDraw: function() {
    let that = this
    this.setData({
      withDrawLoading: true
    });
    //提交数据前校验
    if (!this.data.withDrawParams.amount) {
      this.setData({
        tips: '请输入提现金额',
        withDrawLoading: false,
        showTopTips: true
      })
      return;
    }
    let balance = Number(this.data.withDrawInfo.balance);
    let amount = Number(this.data.withDrawParams.amount);
    if (amount < 1) {
      this.setData({
        tips: '最低提现金额为1元',
        withDrawLoading: false,
        showTopTips: true
      })
      return;
    }

    if (amount > balance) {
      this.setData({
        tips: '账号余额不足',
        withDrawLoading: false,
        showTopTips: true
      })
      return;
    }

    if (!this.data.withDrawParams.code) {
      this.setData({
        tips: '请输入验证码',
        withDrawLoading: false,
        showTopTips: true
      })
      return;
    }

    this.setData({
      isDisabled: true
    })

    wx.login({
      success: res => {

        fetch({
            url: `/settlement/withdraw`,
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              wxcode: res.code,
              ...this.data.withDrawParams
            }
          })
          .then(res => {
            if (!res || res.code == 0) {

              that.setData({
                withDrawInfo: {
                  ...that.data.withDrawInfo,
                  balance: balance - amount
                }
              })

              wx.showToast({
                icon: 'success',
                title: '提现成功',
              })


            } else if (res && res.code == '-1003') {
              wx.showToast({
                icon: 'none',
                title: '验证码错误',
              })
            } else if (res && res.code != 0 && res.msg) {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              });
            }
          })
          .finally(() => {
            this.setData({
              withDrawLoading: false,
              isDisabled: false
            })
          })
          .catch(err => {
            console.error(err);
            this.setData({
              isDisabled: false
            })
            if (err.errtype == 1) {
              wx.showToast({
                title: err.errstr.data.msg,
                icon: 'none'
              });
            }
          })
      }
    });
  }
})