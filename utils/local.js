module.exports = {
  setLocal(key, value) {
    wx.setStorageSync(key, value)
  },
  getLocal(key) {
    return wx.getStorageSync(key)
  }
}