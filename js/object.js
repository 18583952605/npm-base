const watch = {
  observe(obj, key, watchFun) {
    
    // 给该属性设默认值
    let val = obj[key]
    
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(value) {
        obj[key] = value
        // 赋值(set)时，调用对应函数
        watchFun(value, val)
      },
      get() {
        return val
      }
    })
  },
  setWatcher(data = {}, watch = {}) { // 接收index.js传过来的data对象和watch对象
    Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
      this.observe(data, v, watch[v]) // 监听data内的v属性，传入watch内对应函数以调用
    })
  },
}

const get = {
  getCookies(name = '') {
    
  },
  getQuery(url = location.href, name = '') {
    
  }
}

const find = {
  // 在数据里找指定字段
  attr: (variable, attr, curPath) => {
    
    const getType = (variable) => {
      return Object.prototype.toString.call(variable).slice(8, -1)
    }
    
    const isJson = (str) => {
      try {
        if (getType(JSON.parse(str)) === 'Object') {
          return true
        }
      } catch (e) {
      }
      return false
    }
    
    if (isJson(variable)) {
      variable = JSON.parse(variable)
      curPath += '.toString()'
    }
    
    if (getType(variable) === 'Array') {
      for (let index = 0; index < variable.length; index++) {
        const res = findAttr(variable[index], attr, curPath + `[${index}]`)
        if (res) {
          return res
        }
      }
    }
    
    if (getType(variable) === 'Object') {
      if (variable[attr] !== undefined) {
        return curPath + '.' + attr
      }
      
      for (let key in variable) {
        const res = findAttr(variable[key], attr, curPath + `.${key}`)
        if (res) {
          return res
        }
      }
    }
    
  }
}

export default {
  ...watch,
  ...get,
  ...find,
}
