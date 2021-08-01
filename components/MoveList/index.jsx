import React from 'react'
import List from './index'
import {Button, message} from 'antd'

export default class extends React.Component {

  state = {
    dataSource: [],
  }

  componentWillReceiveProps(nextProps = {}) {
    this.setState({dataSource: nextProps.dataSource})
  }

  onMoveItem = (moveType, item, index) => {

    const dataSource = JSON.parse(JSON.stringify(this.state.dataSource))

    // 可行性校验
    if (moveType === 'up' && index === 0) {
      message.error('已经是第一条，不能再上移了~')
      return
    }
    if (moveType === 'down' && index === dataSource.length - 1) {
      message.error('已经是最后一条，不能再下移了~')
      return
    }

    // 换位置
    const moveIndex = moveType === 'up' ? index - 1 : index + 1;
    [dataSource[index], dataSource[moveIndex]] = [dataSource[moveIndex], dataSource[index]]

    this.props.onChangeDataSource(dataSource)
  }

  onDeleteItem = (item, index) => {

    const dataSource = JSON.parse(JSON.stringify(this.state.dataSource))

    // 删除
    dataSource.splice(index, 1)

    this.props.onChangeDataSource(dataSource)

  }

  render() {

    const {
      state: {dataSource = []} = {},
      props: {renderItem = () => null, emptyTip = ''} = {},
      onMoveItem = () => null,
      onDeleteItem = () => null,
    } = this

    return (
      <List
        emptyTip={emptyTip}
        dataSource={dataSource}
        renderItem={(item, index) => (
          <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              {renderItem(item, index)}
            </div>
            <div style={{marginLeft: '10px'}}>
              <Button size='small' icon='up' onClick={() => onMoveItem('up', item, index)} style={{marginRight: '5px'}}/>
              <Button size='small' icon='down' onClick={() => onMoveItem('down', item, index)} style={{marginRight: '5px'}}/>
              <Button size='small' icon='delete' onClick={() => onDeleteItem(item, index)}/>
            </div>
          </div>
        )}
      />
    )
  }

}
