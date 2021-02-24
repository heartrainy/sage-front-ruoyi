import { message } from 'antd'

const SageMessage = {
  success: (text) => message.success(text),
  error: (text) => message.error(text),
  info: (text) => message.info(text),
  warning: (text) => message.warning(text),
  warn: (text) => message.warn(text),
  loading: (text) => message.loading(text)
}

export default SageMessage
