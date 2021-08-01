import React, {useState} from 'react'
import {Input, Popover, Tree} from 'antd'

export default (props) => {
  const {list, menu} = props
  const [value, setValue] = useState('')

  // 渲染一些节点的方法
  const render = {
    treeTitle: (item) => {
      return (
        <Popover trigger='contextMenu' content={menu(item)}>
          <span style={{color: value && item.name.includes(value) ? 'red' : ''}}>{item.name}</span>
        </Popover>
      )
    },
    getTreeNodes: (list = []) => {
      return list.map(item => (
        <Tree.TreeNode key={item._id} title={render.treeTitle(item)}>
          {item.children ? render.getTreeNodes(item.children) : undefined}
        </Tree.TreeNode>
      ))
    },
  }

  return (
    <div style={{height: '100%', width: '300px', display: 'flex', flexDirection: 'column'}}>
      <Input value={value} placeholder='输入关键词可筛选指标分组' onChange={ev => setValue(ev.target.value)}/>
      <div style={{flex: 1, marginTop: '10px', background: '#fff'}}>
        <Tree onSelect={props.onSelect}>
          {render.getTreeNodes(list)}
        </Tree>
      </div>
    </div>
  )
}
