// 封装的微信方法
const system = {
  
  // 获取系统信息
  getSystemInfo() {
    return new Promise(success => {
      wx.getSystemInfo({
        success
      })
    })
  },
  
  // 获取用户userInfo
  getUserInfo(withCredentials = true) {
    return new Promise(success => {
      wx.getUserInfo({
        withCredentials,
        success
      })
    })
  },
  
  // 获取用户authList
  getSetting() {
    return new Promise(success => {
      wx.getSetting({
        success
      })
    })
  },
  
  // 获取微信用户code
  getCode() {
    return new Promise(success => {
      wx.login({
        success
      })
    })
  },
  
  // 获取企业微信用户code
  getQyCode() {
    return new Promise(success => {
      wx.qy.login({
        success
      })
    })
  },
  
  // 获取地理位置
  getLocation(type = 'gcj02') {
    return new Promise(success => {
      wx.getLocation({
        type,
        success
      })
    })
  },
  
  // 获取图片信息
  getImageInfo(src) {
    return new Promise(success => {
      wx.getImageInfo({
        src,
        success
      })
    })
  },
  
  // 相册选择
  chooseImage(count) {
    return new Promise(success => {
      wx.chooseImage({
        count,
        success
      })
    })
  },
  
  // 视频选择
  chooseVideo(count) {
    return new Promise(success => {
      wx.chooseVideo({
        count,
        success
      })
    })
  },
  
  // 获取节点信息 _this取值如果是页面元素就是wx?如果是组件里获取就是组件的this
  getNodeInfo(el, _this = wx, getType = 'boundingClientRect') {
    return new Promise(success => {
      let query = _this.createSelectorQuery()
      query.select(el)[getType]()
      query.exec(success)
    })
  },
  
}

// 一些操作
const fast = {
  
  // 发起请求
  request(option) {
    this.showLoading('正在获取数据')
    
    if (!option.method) {
      option.method = 'POST'
    }
    
    if (!option.data) {
      option.data = {}
    }
    
    return new Promise(resolve => {
      let _this = this
      
      wx.request({
        
        method: option.method,
        url: option.url,
        data: option.data,
        
        complete() {
          _this.hideLoading() // 请求完成，隐藏正在加载的动画
        },
        
        success({data}) {
          
          const {errcode, errmsg} = data
          
          switch (errcode) {
            case 0:
              resolve(data)
              break;
            
            case 1:
              _this.showToast('none', errmsg)
              break;
            
            case 2:
              _this.toUrl(2, `/pages/fail/fail?msg=${errmsg}`)
              break;
            
            default:
              _this.showToast('none', errmsg)
          }
        }
      })
    })
  },
  
  // 获取当前小程序运行环境
  getCurEnv() {
    return new Promise(resolve => {
      system.getSystemInfo().then(({environment}) => {
        if (environment === 'wxwork') {
          resolve('wxwork')
        } else {
          resolve('wx')
        }
      })
    })
  },
  
  // 弹出提示
  showToast(tType, title, time) {
    setTimeout(() => {
      wx.showToast({
        title: title,
        image: tType === 'fail' ? '/icons/fail.png' : '',
        icon: tType,
        duration: time || 2000
      })
    }, 100)
  },
  
  // 弹出确认取消框
  showModal(title = '标题', content = '内容', confirmColor = '#FFCC72') {
    return new Promise(success => {
      wx.showModal({
        title,
        content,
        confirmColor,
        success
      })
    })
  },
  
  // 显示Loading图层
  showLoading(title, mask = true) {
    wx.showLoading({
      title,
      mask,
    })
  },
  
  // 页面滚动到指定位置，默认顶部
  pageScrollTo(scrollTop = 0, duration = 0) {
    wx.pageScrollTo({
      scrollTop,
      duration,
    })
  },
  
  // 隐藏Loading图层
  hideLoading() {
    wx.hideLoading()
  },
  
  // 设置缓存
  setStorage(name, value) {
    wx.setStorageSync(name, value)
  },
  
  // 获取缓存
  getStorage(name) {
    wx.getStorageSync(name)
  },
  
  // 删除缓存
  removeStorage(name) {
    wx.removeStorageSync(name)
  },
  
  // 跳转到指定页面
  toUrl(toType, url, appId, envVersion) {
    
    // 1为普通页面、2为底部Tab网页、3为重定向(之前所有页面出栈)、4为重新打开、5为打开别的小程序
    const map = [
      {fn: wx.navigateTo, data: {url}},
      {fn: wx.switchTab, data: {url}},
      {fn: wx.redirectTo, data: {url}},
      {fn: wx.reLaunch, data: {url}},
      {fn: wx.navigateToMiniProgram, data: {path: url, appId, envVersion}}
    ]
    
    map[toType - 1].fn(map[toType - 1].data)
  },
  
  // 后退到指定页面
  toBack(delta = 1) {
    wx.navigateBack({delta})
  }
}

// 到处
export const obj = {
  ...system,
  ...fast
}
