import React from 'react'
import ReactJson from 'react-json-view'

export default (props = {}) => {
  return (
    <ReactJson
      enableClipboard={false}
      collapsed={true}
      displayObjectSize={false}
      displayDataTypes={false}
      style={{
        maxWidth: props.maxWidth || '400px',
        maxHeight: props.maxHeight || '300px',
        overflow: 'scroll',
      }}
      {...props}
    />
  )
}
