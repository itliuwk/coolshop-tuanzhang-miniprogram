import {
  px2rpx,
  getWinWidth,
  getWinHeight,
  rpx2px
} from '../../utils/util';
import myalert from '../../utils/alert';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: { // 价格
      type: String,
      value: ''
    },
    productname: { // 名称
      type: String,
      value: ''
    },

    tuanNum: { // 多少人团
      type: String,
      value: ''
    },
    username: { //user name
      type: String,
      value: ''
    },
    avater: { // 图片
      type: String,
      value: ''
    },
    productimage: { // productimage
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: "",
    showpost: false,
    imgHeight: 0,
    productCode: "", //二维码
    width: getWinWidth(),
    height: getWinHeight() + 80,
    avater_show: "",
    productimage_show: "",
    codeimg_show: ""
  },

  ready: function() {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    roundRect(ctx, x, y, w, h, r) {
      // 开始绘制
      ctx.beginPath()
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      // ctx.setFillStyle('transparent')
      ctx.setStrokeStyle('transparent')
      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)

      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      // ctx.fill()
      ctx.stroke()
      ctx.closePath()
      // 剪切
      ctx.clip()
    },

    renderText(str, options) {
      var {
        top,
        left,
        color,
        textAlign
      } = options
      var self = this
      this.ctx.setFillStyle(color || '#000');
      this.ctx.setFontSize(15);
      this.ctx.fillText(str, left, top);
    },
    //下载产品图片
    getAvaterInfo: function() {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var productImage = that.data.productimage;

      if (productImage) {
        wx.downloadFile({
          url: productImage,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function(data) {
                that.getQrCode(productSrc, data);

              })
            } else {

              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var productSrc = "";
                  that.getQrCode(productSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getQrCode(productSrc);
      }
    },

    //下载二维码
    getQrCode: function(productSrc) {
      let that = this
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });

      var productCode = that.data.codeimg;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function(res) {
  
            wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.getAvater(productSrc, codeSrc);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var codeSrc = "";
                  that.getAvater(productSrc, codeSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        that.getAvater(productSrc, codeSrc);
      }
    },



    //下载头像
    getAvater: function(productSrc, codeSrc) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var productCode = that.data.avater;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var avaterSrc = res.tempFilePath;
              that.sharePosteCanvas(productSrc, codeSrc, avaterSrc);
            } else {
              wx.showToast({
                title: '用户头像下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var codeSrc = "";
                  var avaterSrc = "";
                  that.sharePosteCanvas(productSrc, codeSrc, avaterSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        var avaterSrc = "";
        that.sharePosteCanvas(productSrc, codeSrc, avaterSrc);
      }
    },




    //canvas绘制分享海报
    sharePosteCanvas: function(productSrc, codeSrc, avaterSrc) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      that.ctx = ctx
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#myCanvas').boundingClientRect(function(rect) {
        const all_width = getWinWidth()
        const all_height = getWinHeight() + 100
        const rect_width = 580
        const rect_height = 710
        //居中 白色的 left top
        var top = rpx2px(254);
        var left = (all_width - rpx2px(rect_width)) / 2
        // console.log("all_width", all_width)
        // console.log("all_height", all_height)
        // console.log("rect_width", rpx2px(rect_width))
        // console.log("left", left)


        //大的黑色背景
        ctx.setFillStyle('#222');
        ctx.fillRect(0, 0, all_width, all_height);

        //居中的白色背景
        ctx.setFillStyle('#fff');
        ctx.save();
        that.roundRect(ctx, left, top, rpx2px(rect_width), rpx2px(rect_height), 10)
        ctx.fillRect(left, top, rpx2px(rect_width), rpx2px(rect_height)); //白色 背景高度固定
        ctx.restore();


        //已为您生成专属海报
        var str = "已为您生成专属海报"
        ctx.setFillStyle('#fff');
        ctx.setFontSize(15);
        ctx.fillText(str, rpx2px(234), rpx2px(134));



        // var str = "99%"
        // ctx.setFillStyle('#FF2D55');
        // ctx.setFontSize(15);
        // ctx.fillText(str, rpx2px(162), rpx2px(194));

        // var str = "的小伙伴转发后领取"
        // ctx.setFillStyle('#fff');
        // ctx.setFontSize(15);
        // ctx.fillText(str, rpx2px(256), rpx2px(194));


        //头像
        if (avaterSrc) {
          ctx.save()
          that.roundRect(ctx, rpx2px(110), rpx2px(294), rpx2px(66), rpx2px(66), rpx2px(66 / 2))
          ctx.drawImage(avaterSrc, rpx2px(110), rpx2px(294), rpx2px(66), rpx2px(66));
          ctx.restore()
        }

        // 我是用户名
        var str = that.data.username
        ctx.setFillStyle('#0083D5');
        ctx.setFontSize(15);
        ctx.fillText(str, rpx2px(196), rpx2px(340));

        // 暖心推荐
        var str = "暖心推荐"
        ctx.setFillStyle('#222');
        ctx.setFontSize(15);
        ctx.fillText(str, rpx2px(that.data.username.length * 15 + 196 + 20 /**,margin-left */ ), rpx2px(340));



        //产品 productimage
        if (productSrc) {
          ctx.drawImage(productSrc, rpx2px(206), rpx2px(376), rpx2px(340), rpx2px(340));
        }

        //产品名称
        if (that.data.productname) {
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(15);
          ctx.fillText((that.data.productname).substr(0, 20), rpx2px(110), rpx2px(780))
          ctx.fillText((that.data.productname).substr(20, 13), rpx2px(110), rpx2px(780 + 35))
        }


        //长按识别二维码，一起来参团！
        var str = "长按识别二维码，查看商品详情"
        ctx.setFontSize(15);
        ctx.setFillStyle('#222');
        ctx.fillText(str, rpx2px(110), rpx2px(924));



        //产品金额
        if (that.data.price || that.data.price == 0) {
          ctx.setFontSize(20);
          ctx.setFillStyle('#FF2D55');
          ctx.setTextAlign('left');
          var price = that.data.price;
          if (!isNaN(price)) {
            price = "¥" + that.data.price
          }
          ctx.fillText(price, rpx2px(110), rpx2px(868));
        }
        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc,
            rpx2px(504), rpx2px(806),
            rpx2px(128), rpx2px(128))

        }
      }).exec()
      that.shareFriends()
      setTimeout(function() {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },


    //保存到手机
    saveToPhone: function(cb) {
      var that = this;
      myalert.loading()
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            myalert.clear()
            console.log(res.tempFilePath)
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    if (res.confirm) {
                      cb()
                    }
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function(err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    if (res.confirm) {}
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function(err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function(src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              var imgHeight = (res2.windowWidth * 0.85 / ratio) + 130;
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight - 130);
            }
          })
        }
      })
    },

    shareFriends: function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          wx.setStorageSync('photo', res.tempFilePath)
        }
      }, this)
    }
  }

})