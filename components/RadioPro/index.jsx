import React from 'react'
import {Checkbox} from 'antd'

// 给Radio组件增加取消选择的功能，是用Checkbox组件实现的
export default (props) => {
  const {value, options, onChange} = props

  const evs = {
    onChange: (v = []) => {
      onChange(v.find(i => i !== value) || '')
    },
  }

  return (
    <Checkbox.Group
      value={[value]}
      prefixCls='ant-radio'
      options={options}
      onChange={evs.onChange}
    />
  )
}
