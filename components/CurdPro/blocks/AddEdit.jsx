import React, {useEffect} from 'react'
import {Form} from 'antd'
import FormItem from '../../FormItem'

export default (props) => {
  const {record, fields = []} = props

  const layout = {
    labelCol: {span: 3},
    wrapperCol: {span: 19},
  }

  const [form] = Form.useForm()
  useEffect(() => props.setForm(form), [form])

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record)
    } else {
      form.resetFields()
      fields.forEach((item) => {
        if (item.default !== undefined) {
          form.setFieldsValue({[item.key]: item.default})
        }
      })
    }
  }, [record])

  const onChange = (values = {}) => {
    form.setFieldsValue(values)
  }

  return (
    <Form {...layout} form={form}>
      {fields.map((item) => (
        <FormItem name={item.key} {...item} onChange={onChange}/>
      ))}
    </Form>
  )
}
