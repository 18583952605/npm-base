import React from 'react'

export default (props) => {
  return (
    <div
      style={{minWidth: '100%'}}
      dangerouslySetInnerHTML={{__html: props.html}}
    />
  )
}
