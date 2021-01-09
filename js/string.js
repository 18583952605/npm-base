const format = {
  // 金钱格式化，每三位加,
  amount(str) {
    const reg = /(?=(?!\b)(\d{3})+$)/g;
    return str.replace(reg, ',');
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
  }
}

const reg = {
  // 是否为url
  isUrl() {
  
  }
}

export default {
  ...format,
  ...reg
}
