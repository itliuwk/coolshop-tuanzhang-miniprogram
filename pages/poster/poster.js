// pages/poster/index.js
import {
  getLocal
} from '../../utils/local';
import fetch from '../../lib/fetch.js';
import config from '../../config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideo: false,
    showOpi: false,
    showPost: false,
    group: {
      // coverImage: 'https://demo.histore.kuaidiantong.cn//Storage/Shop/Products/581/1_350.png',
      // codeimg: 'https://demo.histore.kuaidiantong.cn//Storage/Shop/Products/581/1_350.png',
      // tuanPrice: '168',
      // targetCount: '99',
      // name: '向日葵'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shareGroupId = options.id

    let group = JSON.parse(options.group)

    this.setData({
      group: {
        ...group,
        codeimg: config.BASE_URL + '/store/api/wx/products/qrcode?id=' + group.id + '&access_token=' + wx.getStorageSync('tokenInfo').access_token
      }
    }, () => {
      this.selectComponent('#getPoster').getAvaterInfo()
      this.setData({
        showPost: true
      })
    })





  },
  //调用子组件的方法
  getSharePoster: function() {
    this.setData({
      showVideo: false,
      showOpi: true
    })
    this.selectComponent('#getPoster').getAvaterInfo()
  },

  myEventListener: function(e) {
    this.setData({
      showVideo: true,
      showOpi: false
    })
  },
  share() {
    wx.showShareMenu({
      withShareTicket: false,

    })
  },
  goback() {
    wx.navigateBack({
      delta: 1
    });
  },
  saveToPhone() {
    this.selectComponent('#getPoster').saveToPhone(() => {
      this.goback()
    })
  },
  closepost() {
    this.setData({
      poster: {
        showPost: false,
      }
    })
  },
  onShareAppMessage() {
    var self = this
    var user = getLocal("userInfo") || {
      nickName: ""
    }
    console.log(user)
    return {
      title: `我是 ${user.nickName} , 在社惠团发现一个不错的商品,赶快来看看吧 `,
      imageUrl: this.data.group.coverImage,
      path: `/pages/share/enter/enter?scene=pintuan_${this.data.group.id}`,
      complete() {
        self.goback()
      },
    }
  }

})