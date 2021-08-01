import React from 'react'
import {Checkbox, Form, Input, Radio, Select, Switch} from 'antd'

export default (props) => {
  let {
    type = 'input',
    name,
    label = '',
    valuePropName,
    rules = [],
    list = [],
    onChange = () => undefined,
    search = () => undefined,

    ...options
  } = props

  // 根据type，设置默认的placeholder
  if (options.placeholder === undefined) {
    if (type.includes('input') || type.includes('textarea')) {
      options.placeholder = `请输入${label}`
    }
    if (type === 'input-range') {
      options.placeholder = [`请输入最低${label}`, `请输入最高${label}`]
    }
    if (type === 'input-search') {
      options.onSearch = async (id) => {
        onChange(await search(id))
      }
    }
    if (
      type === 'select' ||
      type === 'picker-time' ||
      type === 'picker-date-range' ||
      type === 'picker-dateTime' ||
      type === 'upload-image'
    ) {
      options.placeholder = `请选择${label}`
    }
    if (type === 'picker-date-single') {
      options.placeholder = `请选择时间`
    }
  }

  // 设置默认的maxLength
  if (options.maxLength === undefined) {
    if (type === 'input') {
      options.maxLength = 100
    }
    if (type === 'textarea') {
      options.maxLength = 300
    }
  }

  // 设置默认的
  if (type === 'switch' && !valuePropName) {
    valuePropName = 'checked'
  }

  // 处理list
  if (Array.isArray(list)) {
    if (typeof list[0] === 'string' || typeof list[0] === 'number') {
      list = list.map((item) => ({label: item, value: item}))
    } else {
      list = list.map((item) => ({label: item.label || item.name, value: item.value || item.id}))
    }
    list = list.map((item, index) => ({key: index, ...item}))
  }

  // 处理rules
  if (rules !== undefined) {
    rules = rules.map((item) => {
      switch (item) {
        case 'required':
          item = {required: true, message: options.placeholder}
          break

        case 'mobile':
          item = {pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误'}
          break

        case 'email':
          item = {
            pattern: /^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/,
            message: '邮箱格式错误',
          }
          break

        case 'url':
          item = {
            pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+/,
            message: 'url格式错误',
          }
          break
      }
      return item
    })
  }

  // 根据type使用不同的表单项
  let element = null
  switch (type) {
    case 'input':
      element = <Input {...options} />
      break
    case 'input-search':
      element = <Input.Search {...options} />
      break
    case 'input-textarea':
      element = <Input.TextArea {...options} />
      break

    case 'radio':
      element = <Radio.Group {...options} options={list}/>
      break

    case 'checkbox':
      element = list ? <Checkbox.Group {...options} options={list}/> : <Checkbox {...options} />
      break

    case 'select':
      element = <Select {...options} options={list}/>
      break

    case 'switch':
      element = <Switch {...options} />
      break
  }

  return (
    <Form.Item name={name} label={label} rules={rules} valuePropName={valuePropName}>
      {element}
    </Form.Item>
  )
}

