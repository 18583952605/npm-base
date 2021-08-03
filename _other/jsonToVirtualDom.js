import {getType} from './tools'

const components = {}
const reactNative = {}
const reactNativeElements = {}

const jsonToVirtualDom = (o) => {
  const type = getType(o)

  if (type === 'Array') {
    return o.map(i => jsonToVirtualDom(i))
  }

  if (type === 'Object') {
    const obj = Object.entries(o).reduce((_o, [key, value]) => {

      if (key === 'component') {
        _o.component = components[o.component] || reactNativeElements[o.component] || reactNative[o.component]
      } else {
        _o[key] = jsonToVirtualDom(value)
      }

      return _o
    }, {})

    if (obj.component) {
      const {component, props, children} = obj
      return React.createElement(component, props, children)
    }

    return obj
  }

  return o
}
