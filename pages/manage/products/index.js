// pages/manage/products/index.js

import fetch from '../../../lib/fetch.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    showRight: false,
    inputVal: "",


    multiIndex: [0, 0, 0],

    categories: [],
    currcategories: [],

    userInfo: {},

    count: 0,

    listEnd: false,

    list: [],
    listParams: {
      from: 0,
      size: 10,
      categoryId: '',
      query: ''
    }
  },
  onLoad() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })


    this.fetchList()
  },


  fetchList() {


    if (this.data.listEnd) {
      return;
    }




    fetch({
      url: '/products',
      isShowLoading: true,
      data: {
        ...this.data.listParams
      }
    }).then(res => {
      res.data.map(item => {
        item.sales = item.sales == null ? 0 : item.sales
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

    fetch({
      url: '/products/count'
    }).then(res => {
      this.setData({
        count: res.data
      })
    });




    fetch({
      url: '/categories/select'
    }).then(res => {
      this.setData({
        categories: res.data
      }, () => {
        this.currcategories(0); //  初始化传 0
      })
    })



  },


  /**
   * 重置
   */
  reset() {
    console.log('重置')
  },

  /**
   * 确认
   */
  confirm() {
    this.setData({
      showRight: !this.data.showRight
    });
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
   * 确定选择 商品分类
   */
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },


  /**
   * 滚动选择 商品分类
   */
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为=', e.detail.value);


    this.currcategories(e.detail.value);


  },

  /**
   * 根据 index  获取当前的值
   */
  currcategories(currIndex) {

    let currcategories = []
    let list1 = []
    let list2 = []
    let list3 = []
    let categoryId = ''

    this.data.categories.map((item1, index1) => {
      list1.push(item1.name)
      if (index1 == currIndex) {
        if (item1.subs == null) {
          item1.subs = []
        }
        categoryId = item1.id
        item1.subs.map(item2 => {
          list2.push(item2.name)
          categoryId = item2.id
          if (item2.subs == null) {
            item2.subs = []
          }
          item2.subs.map(item => {
            categoryId = item.id
            list3.push(item.name)
          })
        })
      }
    });

    currcategories.push(list1, list2, list3);

    this.setData({
      currcategories
    })
  },



  /**
   * 分享
   */
  share(e) {
    let value = e.currentTarget.dataset.item
    let userInfo = this.data.userInfo
    let group = {
      id: value.id,
      coverImage: value.coverImage,
      tuanPrice: value.price,
      targetCount: value.sales,
      name: value.name,
      username: userInfo.nickName,
      avater: userInfo.avatarUrl
    }
    wx.navigateTo({
      url: '/pages/poster/poster?group=' + JSON.stringify(group),
    })
  },



  searchConfirm() {
    this.setData({
      list: [],
      listEnd: false,
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
  },

  toggleRight() {
    this.setData({
      showRight: !this.data.showRight
    });
  },

})