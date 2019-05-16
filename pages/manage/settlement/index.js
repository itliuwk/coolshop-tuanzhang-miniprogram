// pages/manage/settlement/index.js
import fetch from '../../../lib/fetch.js';
import moment from '../../../lib/js/moment.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '',
    settlement: {},
    list: [],
    listEnd: false,
    scrollTop: -1,
    listParams: {
      from: 0,
      size: 10,
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fetchSettlement()
    this.fetchList()
  },

  fetchSettlement() {
    fetch({
      url: '/settlement/summary',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
      this.setData({
        settlement: res.data
      })
    })
  },


  fetchList() {

    if (this.data.listEnd) {
      return;
    }


    fetch({
      url: '/settlement/transactions',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
      res.data.map(item => {
        item.createdDate = moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss');
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


  cashWithdrawal() {
    wx.navigateTo({
      url: './withDraw',
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
      listEnd: false,
      scrollTop: 0,
      listParams: {
        from: 0,
        size: 10,
        type: detail.key,
      }
    }, () => {
      this.fetchList()
    })
  }
})