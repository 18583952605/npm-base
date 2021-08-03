import {useCallback, useEffect, useState} from 'react'

// 进入时隐藏指定元素，销毁时恢复该元素
const useHideFooter = (el = '.ant-layout-footer') => {
  useEffect(() => {
    const e = document.querySelector(el)
    e.style.display = 'none'
    return () => e.style.display = 'block'
  }, [])
}

// visible和info的集合体
const useVisibleInfo = (v = false, i) => {
  const [visible, setVisible] = useState(v)
  const [info, setInfo] = useState(i)
  return [
    visible,
    {
      setTrue: () => setVisible(true),
      setFalse: () => setVisible(false),
      toggle: () => setVisible(!visible),
    },
    [
      info,
      setInfo,
    ],
  ]
}

// 判断某元素滚动时，指定元素是否显示
const useElementScrollVisible = (scroll, target) => {
  const $scroll = document.querySelector(scroll) || {}
  const $scrollRect = $scroll.getBoundingClientRect()

  const [visible, setVisible] = useState(false)
  const [direction, setDirection] = useState('')
  const [rect, setRect] = useState('')

  useEffect(() => {

    const fn = () => {
      const $target = document.querySelector(target) || {}
      const rect = $target.getBoundingClientRect()
      setRect(rect)

      if (rect.bottom < $scrollRect.top) {
        setDirection('top')
        setVisible(false)

      } else if (rect.top > $scrollRect.bottom) {
        setDirection('bottom')
        setVisible(false)

      } else {
        setDirection('show')
        setVisible(true)
      }
    }

    fn()
    $scroll.addEventListener('scroll', fn)

    return () => $scroll.removeEventListener('scroll', fn)
  }, [])

  return {
    visible,
    direction,
    rect,
  }
}

// 强制刷新
const useUpdate = () => {
  const [_, setState] = useState(0)
  return useCallback(() => setState(num => num + 1), [])
}

export default {
  useHideFooter,
  useVisibleInfo,
  useElementScrollVisible,
  useUpdate,
}
