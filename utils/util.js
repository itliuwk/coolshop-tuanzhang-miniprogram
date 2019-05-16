import moment from '../lib/js/moment'
// new Date 转成 Y M D H M S
const formatTime = date => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}


// new Date 转成 Y M D
const formatDate = date => {
  if (!date) {
    return false
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}


//时间戳转换成日期时间
function formatTimeTwo(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString()); //typescript转换写法
  var milliseconds = now_new - dateTime;
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getWinHeight = () => {
  return wx.getSystemInfoSync().windowHeight
}
const getWinWidth = () => {
  return wx.getSystemInfoSync().windowWidth
}

const rpx2px = (rpx) => {
  return rpx / 750 * getWinWidth()
}
const px2rpx = (px) => {
  return px / getWinWidth() * 750
}

const str2bool = (str) => {
  return (/^true$/i).test(str);
}



function download(file) {
  return new Promise((reslove) => {
    wx.downloadFile({
      url: file,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          reslove(res.tempFilePath)

        } else {
          reslove(null)
        }
      },
      fail() {
        reslove(null)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatTimeTwo: formatTimeTwo,
  getWinHeight,
  getWinWidth,
  rpx2px,
  px2rpx,
  str2bool,
  download
}