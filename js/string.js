const format = {
  // 金钱格式化，每三位加,
  amount(str) {
    const reg = /(?=(?!\b)(\d{3})+$)/g
    return str.replace(reg, ',')
  },

  // 保留指定位数的小数
  limitDecimals(value, num = 2, isForce = false) {
    value = parseFloat(value)
    if (isNaN(value)) {
      if (isForce) {
        value = 0
      } else {
        return ''
      }
    }
    return value.toFixed(num).toString()
  },
}

const reg = {
  // 是否为url
  isUrl() {

  },
}

const get = {
  // 获取变量的类型
  getType: (value) => {
    return Object.prototype.toString.call(value).slice(8, -1)
  },
  // 将变量转为字符串
  toString: (value) => {
    return Object.prototype.toString.call(value).slice(8, -1) === 'object' ? JSON.stringify(value) : String(value)
  },

  // 生成随机颜色
  getRandomColor: () => {
    const color = Math.floor(Math.random() * 16777215).toString(16)
    if (color.length === 6) {
      return color
    } else {
      return getRandomColor()
    }
  },

  // 将config转换为连接mongo的url
  getMongoUrl: (config) => {
    return `mongodb://${config.username}:${config.password}@${config.host[0]},${config.host[1]}/${config.db}?replicaSet=${config.replicaset}`
  },

  // 获取指定cookie
  getCookie: (name) => {
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
    const arr = document.cookie.match(reg)
    return arr ? unescape(arr[2]) : null
  },
}

export default {
  ...format,
  ...reg,
  ...get,
}
