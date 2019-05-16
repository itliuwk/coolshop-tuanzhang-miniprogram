//index.js
import fetch from '../../lib/fetch.js';
import moment from '../../lib/js/moment.js';
//获取应用实例

Page({
  data: {

    summaryData: {},
    dateItem: {
      yesterday: false,
      today: true,
      week: false,
      month: false
    },
    funcList: [{
        title: '商品分享',
        icon: 'icon-shangpinfenxiang',
        desc: "商品分享",
        pageUrl: '/pages/manage/products/index'
      },
      {
        title: '订单管理',
        icon: 'icon-dingdanguanli-',
        desc: "订单管理",
        pageUrl: '/pages/manage/order/index'
      },
      {
        title: '会员管理',
        icon: 'icon-huiyuanguanli',
        desc: "会员管理",
        pageUrl: '/pages/manage/member/index'
      },
      {
        title: '扫码提货',
        icon: 'icon-saoma',
        desc: "扫码提货",
        pageUrl: 'seeek'

      },
      {
        title: '提货记录',
        icon: 'icon-tihuo',
        desc: "提货记录",
        pageUrl: '/pages/manage/deliveryRecord/index'
      },
      {
        title: '结算中心',
        icon: 'icon-jiesuanzhongxin',
        desc: "结算中心",
        pageUrl: '/pages/manage/settlement/index'
      },
      {
        title: '账号设置',
        icon: 'icon-shezhi',
        desc: "账号设置",
        pageUrl: '/pages/manage/account/index'
      }
    ]
  },

  onLoad: function(options) {
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == '{}') {
          wx.reLaunch({
            url: '../grant/grant',
          })
        }
      }
    })
  },

  onShow: function() {
    this.fetchSummaryData();
  },


  /**
   * 跳转到相应的功能
   */
  goToFunc: function(e) {
    let url = e.currentTarget.dataset.url;
    if (url != 'seeek') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      wx.scanCode({
        success(res) {
          let id = JSON.parse(res.result).id
          let obj = {
            id,
            scanCode: true,
            state: 'TO_PICKUP'
          }
          wx.navigateTo({
            url: `../manage/order/index?item=${JSON.stringify(obj)}`,
          })
        }
      })
    }
  },


  /**
   * 获取汇总数据
   */
  fetchSummaryData() {

    let start, end = moment().format('YYYY-MM-DD');
    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      start = moment().subtract(1, 'day').format('YYYY-MM-DD');
      end = moment().subtract(1, 'day').format('YYYY-MM-DD');
    } else if (dateItem.today) {
      start = moment().format('YYYY-MM-DD');
    } else if (dateItem.week) {
      start = moment().subtract(1, 'week').format('YYYY-MM-DD');
    } else if (dateItem.month) {
      start = moment().subtract(1, 'month').format('YYYY-MM-DD');
    }

    fetch({
        url: '/analytics/summary',
        isShowLoading: true,
        data: {
          start: start,
          end: end
        }
      })
      .then(res => {
        this.setData({
          summaryData: res.data
        });
      })
  },


  /**
   * 下一个日期时间段
   */

  nextDate: function() {

    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: true,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.today) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: true,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.week) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: false,
          month: true
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    }
  },


  /**
   * 上一个日期时间段
   */

  lastDate: function() {

    let dateItem = this.data.dateItem;
    if (dateItem.yesterday) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: false,
          week: false,
          month: true,
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.today) {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else if (dateItem.week) {
      this.setData({
        dateItem: {
          yesterday: false,
          today: true,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    } else {
      this.setData({
        dateItem: {
          yesterday: true,
          today: false,
          week: false,
          month: false
        }
      }, () => {
        this.fetchSummaryData();
      })
    }
  }

})