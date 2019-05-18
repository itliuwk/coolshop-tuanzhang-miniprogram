// pages/manage/order/index.js

import fetch from '../../../lib/fetch.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    scanCode: false,
    inputVal: '',
    calcH: '105px',
    list: [],
    current: '',
    scrollTop: -1,
    listParams: {
      from: 0,
      size: 10,
      query: '',
      state: '',
      customerId: ''
    },

    item:{},


    listEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.item) {
      let item = JSON.parse(options.item)
      let calcH = '105px'
      if (item.scanCode) {
        calcH = '60px'
      }
      this.setData({
        item,
        scanCode: item.scanCode || '',
        calcH,
        listParams: {
          ...this.data.listParams,
          customerId: item.id,
          state: item.state || ''
        }
      })
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
    this.setData({
      list: [],
      listEnd: false,
      listParams: {
        ...this.data.listParams,
        from: 0,
        size: 10
      },
    }, () => {
      this.fetchList()
    })

  },


  fetchList() {

    if (this.data.listEnd) {
      return;
    }

    fetch({
      url: '/orders',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
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
   * 订单详情
   */
  orderDetail(e) {
    wx.navigateTo({
      url: './detail?item=' + JSON.stringify(e.currentTarget.dataset.item),
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


  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key,
      list: [],
      scrollTop: 0,
      listEnd: false,
      listParams: {
        from: 0,
        size: 10,
        query: this.data.inputVal,
        state: detail.key,
        customerId: this.data.item.id || ''
      }
    }, () => {
      this.fetchList()
    })
  },


  searchConfirm() {
    this.setData({
      list: [],
      listEnd: false,
      listParams: {
        ...this.data.listParams,
        from: 0,
        size: 10,
        customerId: this.data.item.id || ''
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
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      listParams: {
        ...this.data.listParams,
        query: '',
        customerId: ''
      }
    });
  },
  inputTyping: function(e) {
    this.setData({
      listParams: {
        ...this.data.listParams,
        query: e.detail.value,
        customerId: ''
      },
      inputVal: e.detail.value
    });
  },
})