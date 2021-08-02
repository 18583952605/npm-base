import {Shape} from '@antv/x6'

export default Shape.Edge.define({
  // 边名称
  shape: 'custom-edge',
  // 属性样式
  attrs: {
    line: {
      stroke: '#ccc',
    },
  },
  // 转弯
  router: {name: 'manhattan'},
  connector: {name: 'rounded'}, // smooth
})