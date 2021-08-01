Talk

import React, {PureComponent} from 'react'
import {Button, List} from 'antd'
import TextSelect from '../TextAnnotate/TextSelect'

export default class Talk extends PureComponent {

  getTalkItemStyle = (item) => {
    const base = {
      padding: '5px',
      borderRadius: '4px',
      maxWidth: '250px',
      whiteSpace: 'break-spaces',
      background: item.bgColor ? `#${item.bgColor}` : '',
    }

    if (item.type === 'doctor' || item.sender === '2') {
      return {
        ...base,
        background: 'rgb(165, 192, 226)',
      }
    }

    if (item.type === 'patient' || item.sender === '1') {
      return {
        ...base,
        background: 'rgb(232, 205, 205)',
      }
    }

    return base
  }

  getListItemStyle = (type) => {
    const base = {
      padding: 0,
      margin: '10px',
      display: 'flex',
      borderBottom: 'none',
    }

    if (type === 'doctor') {
      return {
        ...base,
        justifyContent: 'flex-start',
      }
    }
    if (type === 'patient') {
      return {
        ...base,
        justifyContent: 'flex-end',
      }
    }
  }

  render() {
    let dataSource = this.props.list || []

    return (
      <List
        header='对话'
        bordered
        dataSource={dataSource}
        style={{overflow: 'scroll'}}
        renderItem={(item, index) => (
          <List.Item style={this.getListItemStyle(item.type)}>

            {item.type === 'patient' || item.sender === '1' && (
              <Button
                style={{zoom: '.8', marginRight: '5px'}}
                size='small'
                icon='plus'
                shape='circle'
                onClick={() => this.props.onSelect({text: item.text})}
              />
            )}

            <div style={this.getTalkItemStyle(item)}>
              <TextSelect index={index} text={item.text} metas={item.metas || []} onSelect={this.props.onSelect}/>
            </div>

            {item.type === 'doctor' || item.sender === '2' && (
              <Button
                style={{zoom: '.8', marginLeft: '5px'}}
                size='small'
                icon='plus'
                shape='circle'
                onClick={() => this.props.onSelect({text: item.text})}
              />
            )}
          </List.Item>
        )}
      />
    )
  }

}
