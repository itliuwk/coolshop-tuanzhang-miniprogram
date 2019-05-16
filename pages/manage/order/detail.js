// pages/manage/order/detail.js
import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/js/moment.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    item: {},
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item) {
      this.setData({
        item: JSON.parse(options.item)
      }, () => {
        this.fetchDetail()
      })
    } else {
      this.fetchDetail()
    }

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
   * 订单详情
   */
  fetchDetail() {
    fetch({
      url: '/orders/detail?id=' + this.data.item.id,
    }).then(res => {
      res.data.createdDate = moment(res.data.createdDate).format('YYYY-MM-DD HH:mm:ss');

      this.setData({
        detail: res.data
      })
    })
  },


  /**
   * 确认提货
   */
  confirmDelivery() {
    fetch({
      url: '/orders/pickup?id=' + this.data.item.id,
      method: 'POST',
      data: {
        id: this.data.item.id
      }
    }).then(res => {
      wx.showToast({
        title: '提货成功',
      })
      this.fetchDetail();
    })
  },

  /**
   * 拨打电话
   */
  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  }
})