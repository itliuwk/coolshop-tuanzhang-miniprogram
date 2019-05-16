/**
 * 网络请求
 */
import config from '../config.js'
const BASE_URL = config.BASE_URL;
const app = getApp();
const fetch = function({
  url = '/',
  method = 'GET',
  data = {},
  header,
  isShowLoading = false,
  showLoadingTitle = "加载中..."
}) {
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('tokenInfo').access_token;

    if (!token) {

      return false;
    }
    //显示加载图
    if (isShowLoading) {
      wx.showLoading({
        title: showLoadingTitle,
      })
    }

    /**
     * 在请求的连接上添加access_token
     */
    if (url.includes('?')) {
      url += "&access_token=" + token;
    } else {
      url += "?access_token=" + token;
    }

    /**
     * 添加共同URL路径，七牛获取token除外
     */

    if (!url.includes('/api/qiniu/upToken')) {
      url = "/store/api/wx" + url;
    }
    const requestTask = wx.request({
      url: BASE_URL + url,
      data: data,
      header: header,
      method: method.toUpperCase(),
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          // wx.reLaunch({
          //   url: '/pages/login/login',
          // })
          console.error('code',res);
          reject({
            code: -1,
            errstr: res
          });
        }
      },
      fail: function(res) {
        console.error('fail',res);
        wx.reLaunch({
          url: '/pages/login/login',
        })
        //检查网络状态
        wx.getNetworkType({
          success: function(res) {
            if (res.networkType === 'none') {
              wx.showToast({
                title: '网络出错，请检查网络连接！',
                icon: "none",
                mask: true
              });
            }
          }
        });

        //请求超时处理
        if (res && res.errMsg === "request:fail timeout") {
          wx.showToast({
            title: '网络请求超时！',
            icon: "none"
          });
        }

        reject({
          code: -1,
          errstr: res
        });
      },

      complete: function() {
        //清除加载图
        if (isShowLoading) {
          wx.hideLoading();
        }
        requestTask.abort()
      }
    });


  });
}

export default fetch;