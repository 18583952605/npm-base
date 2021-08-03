import {useRequest} from 'ahooks'
import {message} from 'antd'

// 方法 - 弹出提示
export const msg = (tip, success, msg = '') => {
  const fn = success ? message.success : message.error
  const str = success ? '成功' : '失败: ' + msg
  fn(tip + str)
}

// hook - 发请求的hook
export const useRequestPro = (api, onSuccess) => {
  return useRequest(api, {
    manual: true,
    debounceInterval: 500,
    onSuccess,
  })
}
