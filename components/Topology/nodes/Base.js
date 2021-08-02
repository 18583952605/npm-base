import React from 'react'
import {Shape} from '@antv/x6'
import '@antv/x6-react-shape'

export default Shape.Rect.define({
  width: 100, // 默认宽度
  height: 50, // 默认高度
  attrs: {
    body: {
      rx: 10, // 圆角矩形
      ry: 10,
      fill: '#fff', // 背景颜色
      strokeWidth: 0, // 描边颜色
      stroke: '#fff',
    },
    label: {
      fill: '#000',
      fontSize: 14,
      textAnchor: 'middle',
    },
  },
  ports: {
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
  },
})