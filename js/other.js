// 检查数据是否满足指定规则
const checkRule = (value, rules = []) => {

  /* 使用示例
  rules = [
    {rule: '', msg: '不能为空'},
    {rule: 'noNumber', msg: '必须为数值'},
    {rule: 'noNumber_Int', msg: '必须为整数'},
    {rule: '==0', msg: '不能等于0'},
    {rule: '<-10', msg: '不能小于-10'},
    {rule: '>10', msg: '不能大于于0'},
    {rule: 'noMobile', msg: '必须为手机号'},
  ]

  const res = this.checkRule(formData.num, rules)
  if (res.success) { // success为true代表 数据满足rule
    alert(res.msg)
  }
  */

  let msg = ''

  let success = rules.some(item => {

    let rule = (typeof item == 'string') ? item : item.rule

    // 判断是否为''
    if (rule === '') {
      if (value === undefined || String(value).trim() === '') {
        msg = item.msg
        return true
      }
    }

    // 判断是否为数值
    if (rule === 'noNumber') {
      if (String(value).trim() === '' || isNaN(value)) {
        msg = item.msg
        return true
      }
    }

    // 判断是否为整数
    if (rule === 'noNumber_Int') {
      if (String(value).trim() === '' || isNaN(value) || parseInt(value) != value) {
        msg = item.msg
        return true
      }
    }

    // 判断是否为手机号
    if (rule === 'noMobile') {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        msg = item.msg
        return true
      }
    }

    // 判断数值大小
    if (rule) {

      let operator = rule.match(/^>=|^<=|^>|^<|^==/)
      if (operator) {
        rule = rule.replace(/^>=|^<=|^>|^<|^==/, '')

        if (String(value).trim() === '' || isNaN(value)) {
          msg = item.msg
          return true
        }

        switch (operator[0]) {
          case '>':
            if (parseFloat(value) > parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break

          case '<':
            if (parseFloat(value) < parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break

          case '>=':
            if (parseFloat(value) >= parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break

          case '<=':
            if (parseFloat(value) <= parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break

          case '==':
            if (parseFloat(value) == parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break
        }
      }
    }

  })

  return {
    success,
    msg,
  }

}

// 检查变量是否为空， {} || [] || NaN || undefined || null
const isEmpty = (value) => {

  if (isNaN(value) || value === undefined || value === null) {
    return true
  }

  if (Object.keys(value).length === 0) {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

}

// 防抖函数
const debounce = (fn, wait = 300) => {
  let timer = -1
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// 节流函数
const throttle = (fn, wait = 300) => {
  let timer = -1
  return (...args) => {
    if (Date.now() - timer > wait) {
      timer = Date.now()
      fn(...args)
    }
  }
}

// 地址栏方面的
const location = {
  // url地址的query转为query对象
  url2Params: (url = location.href) => {
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
  },

  // 参数对象转换为url
  params2Url: (params) => {
    let url = ''
    for (let k in params) {
      if (k) {
        url += `${k}=${params[k]}&`
      }
    }
    return url.substr(0, url.length - 1)
  },

  // 设置地址栏参数
  setUrlParams: (key, value, keepName) => {
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
  },

  // 取地址栏的path部分
  urlGetPath: (url = location.href) => {
    // 计算要截取的最后一位
    let lastIndex = url.indexOf('?')
    if (lastIndex === -1) {
      lastIndex = url.length
    }

    return url.slice(0, lastIndex)
  },
}

export default {
  checkRule,
  isEmpty,
  debounce,
  throttle,
  location,
}
