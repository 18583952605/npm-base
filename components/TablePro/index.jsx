import React, {useEffect, useState} from 'react'
import {Button, Card, Drawer, Space} from 'antd'

import Table from './blocks/Table'
import AddEdit from './blocks/AddEdit'

import localDataFn from '../../utils/LocalData'

export default (props) => {
  const {name = '', keyIndex = '', columns = [], fields = [], isShowExpandable = false} = props

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(`添加${name}`)

  const [dataSource, setDataSource] = useState([])

  const [index, setIndex] = useState(undefined)
  const [record, setRecord] = useState(undefined)

  const [form, setForm] = useState(undefined)

  const localData = localDataFn(keyIndex)()

  useEffect(() => {
    keyIndex && setDataSource(localData.get())
  }, [keyIndex])

  const ev = {
    hideModal() {
      setVisible(false)
    },
    showModal(index, record) {
      setRecord(record)
      setIndex(index)
      setTitle(record ? `修改${name}` : `添加${name}`)
      setVisible(true)
    },
    onDelete(index) {
      localData.delete(index)
      setDataSource(localData.get())
    },
    onRefresh() {
      setDataSource(localData.get())
    },
    onAddEdit() {
      form.validateFields().then((data) => {
        if (title === `添加${name}`) {
          localData.add(data)
        } else {
          localData.edit(index, data)
        }
        setVisible(false)
        setDataSource(localData.get())
      })
    },
  }

  if (!columns.find((item) => item.title === '操作')) {
    columns.push({
      title: '操作',
      render: (r, record, index) => {
        return (
          <Space size='middle'>
            <Button type='link' onClick={() => ev.showModal(index, record)}>修改</Button>
            <Button type='link' onClick={() => ev.onDelete(index)}>删除</Button>
          </Space>
        )
      },
    })
  }

  const el = {
    extra: <Button type='link' onClick={ev.showModal}>{`添加${name}`}</Button>,
  }

  return (
    <div>
      <Card
        title={`${name}列表`}
        size='small'
        className={{width: '100%'}}
        bodyStyle={{padding: 0}}
        extra={el.extra}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          onEdit={ev.showModal}
          onCopy={ev.onCopy}
          onDelete={ev.onDelete}
          onRefresh={ev.onRefresh}
          isShowExpandable={isShowExpandable}
        />
      </Card>
      <Drawer
        title={title}
        visible={visible}
        onClose={ev.hideModal}
        width='60%'
      >
        <AddEdit setForm={setForm} record={record} fields={fields}/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Button type='primary' onClick={ev.onAddEdit}>保存</Button>
        </div>
      </Drawer>
    </div>
  )
}
