import React, {Component} from 'react'

import {Input, message, Modal} from 'antd'
import {Graph} from '@antv/x6'

import BaseNode from './nodes/Base'
import ParentNode from './nodes/Parent'
import BaseEdge from './edge/Base'

import {debounce} from '@/utils/tools'
import defaultConfig from './defaultConfig'

export default class extends Component {
  graph = null

  state = {
    isDownKey: {}, // 记录按下的键
  }

  // 初始化Graph，注册节点、绑定事件
  componentDidMount() {

    // 默认props
    const {
      width = '100%',
      height = '100%',
      panning = defaultConfig.panning, // 是否可拖拽画布
      snapline = defaultConfig.snapline, // 是否显示对齐线
      grid = defaultConfig.grid, // 是否显示网格
      history = defaultConfig.history, // 是否记录操作历史
      keyboard = defaultConfig.keyboard, // 是否支持键盘操作
      embedding = defaultConfig.embedding, // 是否能拖拽到别的节点中
      mousewheel = defaultConfig.mousewheel, // 是否能放大缩小
      connecting = defaultConfig.connecting, // 连线时的选项
      selecting = defaultConfig.selecting, // 是否可以框选
    } = this.props || {}

    // 初始化
    this.graph = new Graph({
      container: document.getElementById('container'),
      width,
      height,
      panning,
      snapline,
      grid,
      embedding,
      mousewheel,
      connecting,
      selecting,
      history,
      keyboard,
    })

    // 将组件封装的默认节点注册到画布，重复注册会报错，所以加个try/catch
    try {
      Graph.registerNode('baseNode', BaseNode) // 默认节点
      Graph.registerNode('parentNode', ParentNode) // 默认父节点
      Graph.registerNode('baseEdge', BaseEdge) // 默认线
    } catch (err) {
    }

    // 绑定事件
    setTimeout(() => {
      // 添加一些传递给用户的事件
      this.addUserEvent()
      // 点击节点时,高亮节点与祖先节点之间的边的颜色
      this.addEdgeHighlightEvent()

      // 编辑模式才需要绑定的事件
      if (this.props.mode === 'edit') {
        // 处理节点的事件
        this.addNodeEvent()
        // 处理移动节点的事件
        this.addNodeMoveEvent()
        // 处理框选节点的事件
        this.addNodeSelectionEvent()

        // 处理边的事件
        this.addEdgeEvent()
        // 处理连线的事件
        this.addEdgeConnectEvent()

        // 处理快捷键事件
        this.addKeyboardEvent()
        // 处理键盘按下的事件
        this.addKeyDownEvent()

        // 处理节点或线改变的事件
        this.addCellChangeEvent()
      }
    }, 500)

  }

  // props改变时，将数据显示到Graph
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.setData(nextProps)
    }
  }


  // 事件 - 处理边的事件 (移入移出时添加删除小按钮)
  addEdgeEvent = () => {
    // 鼠标移入边时，添加删除边的小按钮
    this.graph.on('edge:mouseenter', ({edge}) => {
      edge.addTools({
        name: 'button-remove',
        args: {distance: -30},
      })
    })

    // 鼠标移出边时，去掉删除边的小按钮
    this.graph.on('edge:mouseleave', ({edge}) => {
      edge.removeTools()
    })
  }

  // 事件 - 处理连线的事件  (连接时显示隐藏全部链接桩)
  addEdgeConnectEvent = () => {

    // 开始连线时，显示全部链接桩
    this.graph.on('edge:added', () => {
      this.changePortsVisible(true)
    })

    // 连线完成时，隐藏全部链接桩
    this.graph.on('edge:connected', () => {
      this.changePortsVisible(false)
    })

    // 连接取消时，隐藏全部链接桩
    this.graph.on('edge:removed', () => {
      this.changePortsVisible(false)
    })

  }

  // 事件 - 处理节点的事件 (移入移出时添加删除小按钮和链接桩)
  addNodeEvent = () => {
    // 鼠标移入节点时
    this.graph.on('node:mouseenter', ({node, view}) => {
      // 显示被移入节点的链接桩
      this.changePortsVisible(true, view.container)
      // 到最顶层
      node.toFront({deep: true})
      // 添加删除节点的小按钮
      node.addTools({
        event: 'node:delete',
        name: 'button-remove',
        args: {
          x: '100%',
          y: '0',
          offset: {x: -10, y: 10},
        },
      })
    })

    // 鼠标移出节点时
    this.graph.on('node:mouseleave', ({node, view}) => {
      // 隐藏被移出节点的链接桩
      this.changePortsVisible(false, view.container)
      // 隐藏删除节点的小按钮
      node.removeTools()
    })
  }

  // 事件 - 处理节点移动的事件 (移动时自动放大缩小父节点)
  addNodeMoveEvent = () => {
    // 节点移动位置时，处理是否移出父节点，处理父节点自动增加或缩小
    this.graph.on('node:change:position', ({node, options}) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()

      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()

      if (parent && parent.isNode()) {
        // 未按住shift时，会自动扩大父节点的大小
        // 按住shift时，会将节点移出父节点
        if (!this.state.isDownKey.shift) {
          this.autoParantNodeSize(parent)
        }
      }
    })
  }

  // 事件 - 处理快捷键事件 (监听撤回与重做，监听指定键位的是否按下)
  addKeyboardEvent = () => {
    // 监听到command+z时，撤回上一步
    this.graph.bindKey('command+z', () => {
      this.graph.history.undo()
    })

    // 监听到shift+command+z时，重做上一步
    this.graph.bindKey('shift+command+z', () => {
      this.graph.history.redo()
    })
  }

  // 事件 - 监听键盘按下的事件 (监听shift键是否按下)
  addKeyDownEvent = () => {
    // 方法 - 监听按键是否按下
    const listenerKeyDown = (key) => {
      this.graph.bindKey(key, () => {
        const {isDownKey} = this.state
        isDownKey[key] = true
        this.setState({isDownShiftKey: true})
      }, 'keydown')

      this.graph.bindKey(key, () => {
        const {isDownKey} = this.state
        isDownKey[key] = false
        this.setState({isDownKey})
      }, 'keyup')
    }

    // 监听shift键是否按下
    listenerKeyDown('shift')
  }

  // 事件 - 处理框选节点的事件 (创建分组)
  addNodeSelectionEvent = () => {
    this.graph.on('selection:changed', (args) => {

      // 只选中一个节点时，不能创建分组
      if (args.selected.length <= 1) {
        args.selected.forEach(node => node.removeTools())
        this.changePortsVisible(false)
        return
      }

      // 弹窗提示输入分组名称
      Modal.confirm({
        title: '请输入分组名称',
        content: <Input onChange={ev => this.setState({groupName: ev.target.value})}/>,
        onOk: () => {

          // 判断名称合法性
          if (!this.state.groupName) {
            message.error('请输入分组名称')
            return Promise.reject()
          }

          // 创建父节点，根据是否有parentRender方法，判断是否创建默认父节点
          const {node: {parentRender}} = this.props

          const parent = this.graph.createNode({
            zIndex: 1,
            label: this.state.groupName,
            shape: parentRender ? 'react-shape' : 'parentNode',
            ports: parentRender ? defaultConfig.ports : undefined,
            component: parentRender ? node => parentRender({label: this.state.groupName}, node) : undefined,
          })

          // 将选中的节点添加到父节点中
          args.selected.forEach(i => parent.addChild(i))

          // 自动设置父节点的尺寸
          this.autoParantNodeSize(parent)

          // 清除选区
          this.graph.cleanSelection()

          // 将父节点添加到画布中
          this.graph.addNode(parent)
        },
        onCancel: () => {
          this.setState({groupName: ''})
          this.graph.cleanSelection()
        },
      })
    })
  }

  // 事件 - 处理节点或线改变的事件 (添加删除节点边|移动节点)
  addCellChangeEvent = () => {
    // 方法 - 将数据传到父组件
    const change = () => {
      let {onChange = () => undefined} = this.props
      onChange(this.handleJsonToData(this.graph.toJSON()))
    }

    // 边连接完成时
    this.graph.on('edge:connected', change)

    // 节点添加时
    this.graph.on('node:added', change)

    // 节点或边被删除时
    this.graph.on('cell:removed', change)

    // 节点的位置改变时
    this.graph.on('node:moved', change)
  }

  // 事件 - 添加一些传递给用户的事件 (点击节点)
  addUserEvent = () => {
    // 鼠标点击节点时
    this.graph.on('node:click', ({node}) => {
      let {node: {onClick = () => undefined} = {}} = this.props
      onClick(node)
    })
  }

  // 事件 - 处理点击节点时,高亮节点与祖先节点之间的边的颜色
  addEdgeHighlightEvent = () => {
    this.graph.on('node:click', ({node}) => {
      this.setAncestorEdgesColor(node)
    })
  }


  // 方法 - 处理data转json
  handelDataToJson = (props = {}) => {
    const {data = {}} = props

    // 方法 - 包装node数据
    const wrapperNode = (item = {}, props = {}) => {
      let {node: {type, render} = {}} = props

      // 没有node.type时，给默认值
      if (!type) {
        type = render ? 'react-shape' : 'baseNode'
      }

      return {
        ...item,
        width: item?.size?.width || 200,
        height: item?.size?.height || 80,
        shape: item.shape || type, // 优先数据上带的，其次组件传的
        ports: item.ports || defaultConfig.ports,
        component: node => render(item, node),
        zIndex: item.zIndex || 2,
      }
    }

    // 方法 - 包装edge数据
    const wrapperEdge = (item = {}, props = {}) => {
      let {edge: {type = 'baseEdge'} = {}} = props
      return {
        ...item,
        shape: item.shape || type,  // 优先数据上带的，其次组件传的
        zIndex: item.zIndex || 0,
      }
    }

    // 方法 - 包装combo数据
    const wrapperCombo = (item = {}, props = {}) => {
      let {node: {type = 'react-shape', parentRender} = {}} = props

      return {
        ...item,
        width: item?.size?.width || 200,
        height: item?.size?.height || 80,
        shape: item.shape || type, // 优先数据上带的，其次组件传的
        ports: item.ports || defaultConfig.ports,
        component: node => parentRender(item, node),
        zIndex: item.zIndex || 1,
      }
    }

    // 处理ndoes
    const nodes = data.nodes?.map(item => wrapperNode(item, props)) || []

    // 处理edges
    const edges = data.edges?.map(item => wrapperEdge(item, props)) || []

    // 处理combos
    const combos = data.combos?.map(item => wrapperCombo(item, props)) || []

    return {
      nodes: [...nodes, ...combos],
      edges,
    }
  }

  // 方法 - 防抖的setData
  setData = debounce((props) => {
    // 将外部传来的data转为组件需要的数据
    let sourceData = this.handelDataToJson(props)

    // 将sourceData设置到graph
    this.graph.fromJSON(sourceData)
  })

  // 方法 - 控制链接桩是否显示
  changePortsVisible = (visible, container = document.getElementById('container')) => {
    const ports = container.querySelectorAll('.x6-port-body')
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }

  // 方法 - 给指定节点到祖先节点的边设置颜色
  setAncestorEdgesColor = (node) => {
    // 给边设置颜色
    const setColor = (edge = {}, stroke = '#ccc') => {
      edge.setAttrs({line: {stroke}})
    }

    // 递归查找边，并给边设置颜色
    const findEdge = (edges = [], targetId = '', color) => {
      const edge = edges.find(i => i.target.cell === targetId) // 找到符合条件的边

      if (edge) {
        // 避免死循环
        if (edge.attrs.line.stroke === color) {
          return
        }

        setColor(edge, color)
        edge.toFront()
        findEdge(edges, edge.source.cell, color)
      }
    }

    // 取所有的边
    const edges = this.graph.getEdges() || []

    // 将所有的边设置为默认颜色
    edges.forEach(item => setColor(item))

    // 查找经过的边并设置颜色
    findEdge(edges, node.id, '#1890ff')
  }

  // 方法 - 自动计算父节点的宽高
  autoParantNodeSize = (parent) => {
    let originSize = parent.prop('originSize')
    if (originSize == null) {
      originSize = parent.getSize()
      parent.prop('originSize', originSize)
    }

    let originPosition = parent.prop('originPosition')
    if (originPosition == null) {
      originPosition = parent.getPosition()
      parent.prop('originPosition', originPosition)
    }

    let x = Infinity
    let y = Infinity
    let cornerX = originPosition.x + originSize.width
    let cornerY = originPosition.y + originSize.height
    let hasChange = false

    const children = parent.getChildren()
    if (children) {
      children.forEach((child) => {
        const bbox = child.getBBox().inflate(10, 50)
        const corner = bbox.getCorner()

        if (bbox.x < x) {
          x = bbox.x
          hasChange = true
        }

        if (bbox.y < y) {
          y = bbox.y
          hasChange = true
        }

        if (corner.x > cornerX) {
          cornerX = corner.x
          hasChange = true
        }

        if (corner.y > cornerY) {
          cornerY = corner.y
          hasChange = true
        }


        if (corner.x < x) {
          x = corner.x
          hasChange = true
        }

        if (corner.y < y) {
          y = corner.y
          hasChange = true
        }


      })
    }

    if (hasChange) {
      parent.prop(
        {
          id: parent.id, // 修改尺寸后设置为原来的id，不然id会重新随机生成
          position: {x, y},
          size: {width: cornerX - x, height: cornerY - y},
        },
        {skipParentHandler: true},
      )
    }
  }

  // 方法 - 处理json转data
  handleJsonToData = (json) => {
    const {cells = []} = json

    const nodes = cells.filter(item => !item.children?.length && !item.source).map(item => ({
      ...item,
      x: parseInt(item.position.x),
      y: parseInt(item.position.y),
    }))

    const edges = cells.filter(item => item.source?.cell && item.target?.cell).map(item => ({
      ...item,
      source: item.source.cell,
      target: item.target.cell,
    }))

    const combos = cells.filter(item => item.children?.length && !item.source).map(item => ({
      ...item,
      x: parseInt(item.position.x),
      y: parseInt(item.position.y),
      width: parseInt(item.size.width),
      height: parseInt(item.size.height),
    }))

    return {nodes, combos, edges}
  }

  render() {
    return (
      <div id='container' style={{height: '100%'}}/>
    )
  }
}