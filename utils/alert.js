const myalert = {}
myalert.success = (title) => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 1000,
  })
}

myalert.fail = (title) => {
  wx.showToast({
    title,
    image: '/images/close.png',
    duration: 1000,
  })
}
myalert.loading = () => {
  wx.showToast({
    title: "加载中",
    icon: 'loading',
    mask: true,
    duration: 10000,
  })
}
myalert.close = myalert.clear = () => {
  wx.hideToast()
}
myalert.sureOrNot = myalert.confirm = (content, title, confirmText, cancelText) => {
  return new Promise(resolve => {
    wx.showModal({
      title: title || '提示',
      content: content,
      cancelText: cancelText || "取消",
      confirmText: confirmText || "确定",
      cancelColor: "#C7C7CC",
      confirmColor: "#FF2D55",
      success: function (sm) {
        resolve(sm)
      }
    })
  })

}
module.exports = myalert