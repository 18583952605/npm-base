import React, {useEffect} from 'react'
import {Image} from 'antd'
import {url2Params} from '../../utils/tools'

// 在图片上，根据坐标，画矩形
export default () => {

  const params = url2Params(location.href)

  const url = decodeURIComponent(params.url) || ''
  const resList = JSON.parse(decodeURIComponent(params.res || '[]'))
  console.log(666, url, resList)

  const colors = ['4de3ef', 'daab25', 'baff9f', '7b6e37', 'bf2f22', '5744b8', '3fa55d', 'c0f634', '20fb5f', 'ed77e3', '239901', '9f79ee', '9d9775', '3b23f0', 'fd8bdb', 'e6ba86', '1c8d11', '3e8223', 'e447b4', '34c5bd']

  const onLoad = () => {
    const getRectDiv = (options, index) => {
      const {res = []} = options
      const color = colors[index]

      const left = res[0]
      const top = res[1]
      const width = res[2] - res[0]
      const height = res[3] - res[1]

      const div = document.createElement('div')

      // 矩形样式
      div.style.border = `solid 2px #${color}`
      div.style.width = `${width}px`
      div.style.height = `${height}px`
      div.style.top = `${top}px`
      div.style.left = `${left}px`
      div.style.position = `absolute`
      div.style.transition = `transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s`
      div.style.transformOrigin = `${document.body.offsetWidth / 2 - left}px ${document.body.offsetHeight / 2 - top}px`

      // 矩形编号
      div.style.color = `#${color}`
      div.style.fontSize = `18px`
      div.style.fontWeight = `700`
      div.style.textAlign = `left`
      div.innerHTML = `<span style='margin-left: -20px'>${index}</span>`

      return div
    }

    const parentWrap = document.querySelector('.ant-image-preview-img-wrapper')
    const oper = document.querySelector('.ant-image-preview-operations')
    const img = document.querySelector('.ant-image-preview-img')

    // 添加矩形
    resList.forEach((item, index) => {
      const sourceImg = document.createElement('img')
      sourceImg.src = img.src

      // 根据原图被缩放的比例，等比缩放坐标
      item[0] *= img.width / sourceImg.width
      item[2] *= img.height / sourceImg.height
      item[1] *= img.width / sourceImg.width
      item[3] *= img.height / sourceImg.height

      // 加上由于居中产生的偏移量
      item[0] += img.offsetLeft
      item[2] += img.offsetLeft
      item[1] += img.offsetTop
      item[3] += img.offsetTop

      const div = getRectDiv({res: item}, index)
      parentWrap.appendChild(div)

      // 把img的transform同步给矩形
      oper.addEventListener('click', () => {
        setTimeout(() => div.style.transform = img.style.transform, 0)
      })
    })
  }

  // 触发img点击事件，打开图片预览
  useEffect(() => {
    const img = document.querySelector('.ant-image-img') || {}
    img.click()
    img.style.display = 'none'
  }, [])

  // 去掉 关闭预览功能
  useEffect(() => {
    setTimeout(() => {
      // 去掉 点击遮罩层的关闭功能
      const imgWrap = document.querySelector('.ant-image-preview-wrap')
      imgWrap.onclick = (ev) => {
        if (ev.target === imgWrap) {
          ev.stopPropagation()
        }
      }

      // 去掉 关闭按钮
      const closeBtn = document.querySelector('.ant-image-preview-operations-operation')
      closeBtn.parentElement.removeChild(closeBtn)
    }, 500)
  }, [])

  return (
    <Image src={url} alt='img' onLoad={onLoad}/>
  )
}
