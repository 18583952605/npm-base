import React, {useEffect} from 'react'
import {Spin} from 'antd'
import {useBoolean} from 'ahooks'

export default (props) => {

  const {url, height = '', message = ''} = props

  const [loading, {setTrue, setFalse}] = useBoolean(true)

  useEffect(setTrue, [url])

  if (!url) {
    return <span>{message || '没有url'}</span>
  }

  return (
    <Spin spinning={loading}>
      <iframe
        src={url}
        frameBorder={0}
        width='100%'
        style={{height}}
        onLoad={setFalse}
      />
    </Spin>
  )
}
