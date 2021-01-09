const watch = {
  observe(obj, key, watchFun) {
    
    // 给该属性设默认值
    let val = obj[key];
    
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set(value) {
        obj[key] = value;
        // 赋值(set)时，调用对应函数
        watchFun(value, val);
      },
      get() {
        return val;
      }
    })
  },
  setWatcher(data = {}, watch = {}) { // 接收index.js传过来的data对象和watch对象
    Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
      this.observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
    })
  },
}

const get = {
  getCookies(name = '') {
  
  },
  getQuery(url = location.href, name = '') {
  
  }
}

export default {
  ...watch,
  ...get,
}
