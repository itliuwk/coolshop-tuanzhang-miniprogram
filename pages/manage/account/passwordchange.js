import fetch from '../../../lib/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    tips: '',
    oldPasswd: null,
    newPasswd: null,
    confirmPasswd: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  oldPasswdHandle: function(e) {
    this.setData({
      oldPasswd: e.detail.value
    });
  },

  newPasswdHandle: function(e) {
    this.setData({
      newPasswd: e.detail.value
    });
  },

  confirmPasswdHandle: function(e) {
    this.setData({
      confirmPasswd: e.detail.value
    })
  },

  confirmHandle: function() {
    if (!this.data.oldPasswd) {
      this.setData({
        showTopTips: true,
        tips: '请输入旧密码'
      });
      this.timeoutCloseTips();
      return;
    }

    if (!this.data.newPasswd) {
      this.setData({
        showTopTips: true,
        tips: '请输入新密码'
      });
      this.timeoutCloseTips();
      return;
    }

    if (this.data.newPasswd.length < 6) {
      this.setData({
        showTopTips: true,
        tips: '密码至少6位'
      });
      this.timeoutCloseTips();
      return;
    }

    if (this.data.newPasswd != this.data.confirmPasswd) {
      this.setData({
        showTopTips: true,
        tips: '两次密码输入不一致'
      });
      this.timeoutCloseTips();
      return;
    }

    fetch({
        url: `/changePassword?oldPassword=${this.data.oldPasswd}&newPassword=${this.data.newPasswd}`,
        method: 'post',
        data: {
          oldPassword: this.data.oldPasswd,
          newPassword: this.data.newPasswd
        }
      })
      .then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })

        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      })
      .catch(err => {
        wx.showToast({
          title: '旧密码填写错误',
          icon: 'none'
        })
        console.error(err)
      })

  },

  timeoutCloseTips: function() {
    setTimeout(() => {
      this.setData({
        showTopTips: false
      })
    }, 1500)
  }

})