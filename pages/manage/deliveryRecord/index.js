// pages/manage/deliveryRecord/index.js

import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/js/moment.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    list: [],
    listEnd: false,
    listParams: {
      query: '',
      from: 0,
      size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchList()
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

  fetchList() {

    if (this.data.listEnd) {
      return;
    }
    fetch({
      url: '/pickups',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
      res.data.map(item => {
        item.deliveryTime = moment(item.deliveryTime).format('YYYY-MM-DD HH:mm:ss');
        return item;
      })
      this.setData({
        list: [...this.data.list, ...res.data]
      })

      if (!res.data.length) {
        this.setData({
          listEnd: true
        })
      }
    })
  },



  /**
   * 拨打电话
   */
  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },



  /**
   * 加载更多
   */
  scrolltolower() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        from: this.data.listParams.from + this.data.listParams.size
      }
    }, () => {
      this.fetchList()
    })
  },

  /**
   * 确认键搜索
   */
  searchConfirm() {
    this.setData({
      list: [],
      listEnd:false,
      listParams: {
        ...this.data.listParams,
        from: 0,
        size: 10
      }
    }, () => {
      this.fetchList()
    })
  },


  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        query: ''
      },
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        query: ''
      }
    });
  },
  inputTyping: function(e) {
    this.setData({
      listParams: {
        ...this.data.listParams,
        query: e.detail.value
      }
    });
  }
})