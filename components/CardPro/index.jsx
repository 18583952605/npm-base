import React, {useState} from 'react'
import {Button, Card} from 'antd'

// 给Card组件增加了扩展收缩功能
export default (props = {}) => {
  const {extra, children, actions, defaultIsExpan = false, ...options} = props

  const [isExpan, setIsExpan] = useState(defaultIsExpan)

  const style = {
    btn: {margin: '0 0 0 15px'},
    flex: {display: 'flex'},
  }

  const extraNode = (
    <div style={style.flex}>
      {extra}
      <Button
        size='small'
        type={isExpan ? 'primary' : ''}
        style={style.btn}
        onClick={() => setIsExpan(!isExpan)}
      >
        {isExpan ? '+' : '-'}
      </Button>
    </div>
  )

  return (
    <Card
      extra={extraNode}
      bodyStyle={{padding: isExpan ? 0 : 10}}
      actions={isExpan ? [] : actions}
      {...options}
    >
      <div style={{display: isExpan ? 'none' : 'block'}}>
        {children}
      </div>
    </Card>
  )
}
