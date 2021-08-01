import React from 'react'
import {Descriptions} from 'antd'
import _ from 'lodash'

export default (props) => {

  let {info = [{}], keys = [], ...otherProps} = props

  if (_.isPlainObject(info)) {
    info = [info]
  }

  const toString = (value) => {
    return _.toString(value).includes('Object') ? JSON.stringify(value) : _.toString(value)
  }

  return (
    info.map((item, index) => (
      <Descriptions
        key={index}
        style={{background: '#fff', padding: '15px'}}
        {...otherProps}
      >
        {Object.entries(_.pick(item, keys)).map((([key, value], idx) => (
          <Descriptions.Item key={idx} label={key}>
            {toString(value)}
          </Descriptions.Item>
        )))}
      </Descriptions>
    ))
  )
}
