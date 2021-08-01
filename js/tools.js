import {useRequest} from 'ahooks'
import {message} from 'antd'
import _ from 'lodash'

// 方法 - 从list种查找有指定value的item
export const find = (list, name, value, defaultValue) => {
  return list.find((item) => item[name] === value) || defaultValue
}

// 方法 - 获取变量的类型
export const getType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

// 方法 - 将变量转为字符串
export const toString = (value) => {
  return getType(value) === 'object' ? JSON.stringify(value) : String(value)
}

// 方法 - 过滤对象中为undefined的属性
export const filterParams = (params) => {
  return Object.entries(params || {}).reduce((obj, [key, value]) => {
    if (value !== undefined) {
      obj[key] = value
    }
    return obj
  }, {})
}

// 方法 - url地址的参数转为参数对象
export const url2Params = (url = location.href) => {
  url = decodeURIComponent(url)
  let jsonList = {}
  if (url.indexOf('?') > -1) {
    let str = url.slice(url.indexOf('?') + 1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      jsonList[strs[i].split('=')[0]] = strs[i].split('=')[1] // 如果出现乱码的话，可以用decodeURI()进行解码
    }
  }
  return jsonList || {}
}

// 方法 - 获取地址栏参数 (默认返回全部，也可指定key)
export const getUrlParams = (key = '') => {
  const allParams = url2Params()
  return key ? allParams[key] : allParams
}

// 方法 - 参数对象转换为url
export const params2Url = (params) => {
  let url = ''
  for (let k in params) {
    if (k) {
      url += `${k}=${params[k]}&`
    }
  }
  return url.substr(0, url.length - 1)
}

// 方法 - 设置地址栏参数
export const setUrlParams = (key, value, keepName) => {
  if (key === undefined || value === undefined) return

  // 给地址栏参数对象添加指定参数
  let allParams = getUrlParams()
  if (keepName) {
    allParams = _.pick(allParams, keepName) || {}
  }
  allParams[key] = encodeURIComponent(value)

  // 域名和路径
  const url = location.href
  const sliceEnd = url.indexOf('?') === -1 ? url.length : url.indexOf('?')
  const domainPath = url.slice(0, sliceEnd)

  // 参数
  const params = params2Url(allParams)

  // 修改地址栏url
  location.replace(`${domainPath}?${params}`)
}

// 方法 - 取path
export const urlGetPath = (url = location.href) => {
  // 计算要截取的最后一位
  let lastIndex = url.indexOf('?')
  if (lastIndex === -1) {
    lastIndex = url.length
  }

  return url.slice(0, lastIndex)
}

// 方法 - 弹出提示
export const msg = (tip, success, msg = '') => {
  const fn = success ? message.success : message.error
  const str = success ? '成功' : '失败: ' + msg
  fn(tip + str)
}

// 方法 - 获取指定cookie
export const getCookie = (name) => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  const arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

// 方法 - 防抖函数
export const debounce = (fn, wait = 300) => {
  let timer = -1
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// 方法 - 节流函数
export const throttle = (fn, wait = 300) => {
  let timer = -1
  return (...args) => {
    if (Date.now() - timer > wait) {
      timer = Date.now()
      fn(...args)
    }
  }
}

// hook - 发请求的hook
export const useRequestPro = (api, onSuccess) => {
  return useRequest(api, {
    manual: true,
    debounceInterval: 500,
    onSuccess,
  })
}

// 方法 - 生成随机颜色
export const getRandomColor = () => {
  const color = Math.floor(Math.random() * 16777215).toString(16)
  if (color.length === 6) {
    return color
  } else {
    return getRandomColor()
  }
}

// 将config转换为连接mongo的url
export const getMongoUrl = (config) => {
  return `mongodb://${config.username}:${config.password}@${config.host[0]},${config.host[1]}/${config.db}?replicaSet=${config.replicaset}`
}
