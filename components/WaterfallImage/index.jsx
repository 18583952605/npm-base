import React from 'react'
import {Col, Empty, Row} from 'antd'

export default (props) => {
  const {coloums = 4, gutter = 4, list = [], onImgClick} = props

  if (!list?.length) {
    return (
      <Empty/>
    )
  }

  return (
    <Row gutter={gutter}>
      {(new Array(coloums).fill(1).map((item, index) => (
        <Col span={24 / coloums} key={index}>
          {list.map((item_, index_) => {
            return index_ % 4 === index ? (
              <img
                key={index_}
                src={item_?.query}
                width='100%'
                style={{marginBottom: `${gutter}px`, cursor: onImgClick ? 'pointer' : ''}}
                alt='img'
                onClick={() => onImgClick && onImgClick(item_, index_)}
              />
            ) : null
          })}
        </Col>
      )))}
    </Row>
  )
}
