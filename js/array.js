const del = {
  // 删除指定元素 下标
  // 删除指定元素 元素
  // 删除指定元素 条件
  // 支持批量
}

const get = {
  // 数组 - 根据指定字段，找数组中的某一个对象，第四个参数用作直接返回该对象的指定属性，第五个参数作为找不到对象或该属性时的默认值
  getItem(objArr, key, value, filed, defaultValue) {

    let res = objArr.find(item => item[key] === value)

    if (res && filed) {
      res = res[filed]
    }

    if (!res && defaultValue !== undefined) {
      res = defaultValue
    }

    return res

  },
}

export default {
  ...del,
  ...get,
}
