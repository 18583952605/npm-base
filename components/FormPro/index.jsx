import React, {useEffect} from 'react'

import {Checkbox, DatePicker, Form, Input, Radio, Select, Slider, Switch} from 'antd'

import _ from 'lodash'
import moment from 'moment'
import {useDebounceFn} from 'ahooks'
import {getType, setUrlParams} from '../../js'

// 支持动态显示表单字段的组件
// 支持将指定字段同步到地址栏
export default (props) => {

  const {style = {width: '100%'}, fieldList = [], layout, itemLayout = {}, values, onValuesChange} = props

  const [form] = Form.useForm()

  // type与组件的映射
  const map = {
    input: Input,
    textarea: Input.TextArea,
    select: Select,
    radio: Radio.Group,
    checkbox: Checkbox.Group,
    switch: Switch,
    rangePicker: DatePicker.RangePicker,
    slider: Slider,
  }

  // 默认布局
  const defaultLayout = {
    labelCol: {offset: 2, span: 5},
    wrapperCol: {span: 10},
  }

  // 将values的值设置到Form上
  useEffect(() => {
    form.setFieldsValue(_.pick(values, fieldList.map(i => i.name)))
  }, [values])

  // 当表单值改变时
  const {run} = useDebounceFn((v, values) => {
    const [[key, value]] = Object.entries(v)

    // syncLocation字段：值改变后，是否需要将值同步到地址栏
    const {syncLocation} = fieldList.find(i => i.name === key)

    // 如果需要同步
    if (syncLocation) {
      // 如果这个值是true，表示由框架自动处理值内容
      if (syncLocation === true) {
        // 根据值的类型做不同的处理
        if (['String', 'Number', 'Boolean'].includes(getType(value))) {
          setUrlParams(key, String(value))

        } else if (getType(value) === 'Object') {
          setUrlParams(key, JSON.stringify(value))

        } else if (getType(value) === 'Array') {
          if (value.length) {

            if (['String', 'Number', 'Boolean'].includes(getType(value?.[0]))) {
              setUrlParams(key, value.join())

            } else if (moment.isMoment(moment(value?.[0]))) {
              // 如果是moment对象，则format
              const dates = value.map(item => item.format('YYYY-MM-DD HH:mm:ss')) || []
              setUrlParams(key, dates.join() || '')
            }

          } else {
            setUrlParams(key, '')
          }
        }
      }

      // 如果这个值是function，表示由使用者处理值内容
      if (getType(syncLocation) === 'Function') {
        setUrlParams(key, syncLocation(value))
      }
    }

    onValuesChange(values)
  }, {wait: 500})

  return (
    <Form
      layout={layout}
      {...itemLayout || defaultLayout}
      initialValues={values}
      form={form}
      onValuesChange={run}
      style={style}
    >

      {fieldList.map(({type, flex, ...otherProps}, index) => {

        // 传给Form.Item的props
        const formItemProps = _.pick(otherProps, ['label', 'name', 'rules', 'valuePropName'])

        // 传给组件的props
        const comProps = _.omit(otherProps, ['label', 'name', 'rules', 'valuePropName', 'syncLocation'])

        // 处理下select和radio组件的option属性，如下：
        // ['a', 'b'] => [{label:'a', value:'a'}, {label:'b', value:'b'}]
        const options = comProps?.options
        if (['select', 'radio'].includes(type) && Array.isArray(options) && typeof options[0] === 'string') {
          comProps.options = options.map(i => ({label: i, value: i}))
        }

        // 这两种type，给默认的valuePropName
        if (['switch', 'checkbox'].includes(type) && !formItemProps.valuePropName) {
          formItemProps.valuePropName = 'checked'
        }

        return (
          <Form.Item key={index} {...formItemProps} style={{flex}}>
            {React.createElement(map[type], comProps)}
          </Form.Item>
        )
      })}

    </Form>
  )
}
