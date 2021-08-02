import BaseEdge from './edge/Base'

// 默认布局
const layout = {
  type: 'dagre',
  rankdir: 'LR',
  align: 'UR',
  ranksep: 85,
  nodesep: 35,
}

// 是否可拖拽画布
const panning = true

// 是否显示对齐线
const snapline = true

// 是否显示网格
const grid = true

// 是否记录操作历史
const history = true

// 是否支持键盘操作
const keyboard = true

// 链接桩
const ports = {
  groups: {
    all: {
      position: 'absolute',
      attrs: {
        circle: {
          r: 3,
          magnet: true,
          stroke: '#1890ff',
          strokeWidth: 2,
          fill: '#fff',
          style: {
            visibility: 'hidden', // 默认不显示
          },
        },
      },
    },
  },
  items: [
    // {
    //   id: 'port1',
    //   group: 'all',
    //   args: {x: 0, y: 0},
    // },
    {
      id: 'port2',
      group: 'all',
      args: {x: '50%', y: 0},
    },
    // {
    //   id: 'port3',
    //   group: 'all',
    //   args: {x: '100%', y: 0},
    // },
    {
      id: 'port4',
      group: 'all',
      args: {x: '100%', y: '50%'},
    },
    // {
    //   id: 'port5',
    //   group: 'all',
    //   args: {x: '100%', y: '100%'},
    // },
    {
      id: 'port6',
      group: 'all',
      args: {x: '50%', y: '100%'},
    },
    // {
    //   id: 'port7',
    //   group: 'all',
    //   args: {x: 0, y: '100%'},
    // },
    {
      id: 'port8',
      group: 'all',
      args: {x: 0, y: '50%'},
    },
  ],
}

// 放大缩小画布
const mousewheel = {
  enabled: true,
  modifiers: ['ctrl', 'meta'],
  minScale: 0.7,
  maxScale: 1.3,
}

// 节点连接
const connecting = {
  snap: true, // 自动吸附
  allowBlank: false, // 是否允许连接到画布空白位置的点
  allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
  allowNode: false, // 是否允许边链接到节点
  highlight: true,
  createEdge: () => new BaseEdge(),
}

// 节点选择
const selecting = {
  enabled: true,
  multiple: true,
  rubberband: true,
  modifiers: 'shift',
  showNodeSelectionBox: true,
  following: false,
  filter: node => !(node.children || node.parent), // 父节点||已有父节点的子节点，不会被选择
}

// 节点拖拽
const embedding = {
  enabled: true,
  findParent: 'bbox',
  validate: ev => {
    // 目标节点是父节点，且拖拽的节点是单个节点时，才可以将其加入父节点
    const {parent: target, child: current} = ev
    const isParent = node => node?.children
    return isParent(target) && !isParent(current)
  },
}

// 导出
export default {
  panning,
  snapline,
  grid,
  history,
  keyboard,
  ports,
  mousewheel,
  connecting,
  selecting,
  embedding,
  layout,
}