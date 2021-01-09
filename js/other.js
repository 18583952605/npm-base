class Images {
  // 没写完，不能用
  
  constructor(imgUrl) {
    this.imgUrl = imgUrl;
    (async () => {
      this.imgFile = await this.getFile()
    })()
  }
  
  getFile() {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(this.imgUrl)
      reader.addEventListener('load', () => resolve(reader))
    })
  }
  
  getImg() {
    return new Promise(resolve => {
      const img = new Image()
      img.src = this.imgUrl
      img.onload = () => resolve(img)
    })
  }
  
  gatBase64() {
    return this.imgFile.result
  }
  
  getSize() {
    return this.imgFile.size
  }
  
  getType() {
    return this.imgFile.type
  }
  
  isImage() {
    return this.imgFile.type.includes('image/')
  }
  
  isSize(size) {
    return this.imgFile.size < size
  }
  
}

// 校验 - 检查数据是否满足指定规则
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
            break;
          
          case '<':
            if (parseFloat(value) < parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break;
          
          case '>=':
            if (parseFloat(value) >= parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break;
          
          case '<=':
            if (parseFloat(value) <= parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break;
          
          case '==':
            if (parseFloat(value) == parseFloat(rule)) {
              msg = item.msg
              return true
            }
            break;
        }
      }
    }
    
  })
  
  return {
    success,
    msg
  }
  
}

// 校验 - 检查变量是否为空， {} || [] || NaN || undefined || null
const isEmpty = (value) => {
  
  if (isNaN(value) || value === undefined || value === null) {
    return true
  }
  
  if (JSON.stringify(value) === '{}') {
    return true
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  
}

export default {
  Images,
  checkRule,
  isEmpty,
}
