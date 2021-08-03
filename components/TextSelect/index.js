import React, {PureComponent} from 'react'

function getSelectedText() {
  const selection = window.getSelection()
  if (selection.isCollapsed) {
    return
  }
  let start = selection.anchorOffset
  let end = selection.focusOffset
  if (start > end) {
    let tmp = start
    start = end
    end = tmp
  }
  const length = end - start
  const text = selection.toString()
  window.getSelection().empty()
  return {
    start,
    end,
    length,
    text,
  }
}

export default class Input extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isDown: false,
    }
  }

  onMousedown = () => {
    this.setState({isDown: true})
  }

  onMouseup = () => {
    this.setState({isDown: false})

    const result = getSelectedText()
    if (result === undefined) {
      return
    }

    result.index = this.props.index

    this.props.onSelect(result)
  }

  render() {
    let text = this.props.text || ''
    const style = this.props.style || {}

    // 回显已选择的文本
    let metas = this.props?.metas || []
    metas = metas.sort((a, b) => b?.segment_range[0] - a?.segment_range[0])
    metas.forEach((item, index) => {
      text = text.replaceAll(item.text, (text, index) => {
        if (index === item?.segment_range[0]) {
          const color = item.color || 'red'
          return `<span class='s_${color}' style='color: #${color}'>${text}</span>`
        } else {
          return text
        }
      })
    })

    return (
      <div style={style} onMouseUp={this.onMouseup} onMouseDown={this.onMousedown}>
        <div dangerouslySetInnerHTML={{__html: this.state.isDown ? this.props.text : text}}/>
      </div>
    )
  }
}
