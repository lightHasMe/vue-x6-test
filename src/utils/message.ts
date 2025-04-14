import type { MessageHandler } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useLogger } from './log'

const log = useLogger('Message')
class Message {
  msgInstance?: MessageHandler

  info(msg: string) {
    log.info('', msg)
    if (this.msgInstance != null)
      this.msgInstance.close()

    this.msgInstance = ElMessage({
      type: 'info',
      message: msg,
      showClose: true,
    })
  }

  warning(msg: string) {
    console.warn('', msg)
    if (this.msgInstance != null)
      this.msgInstance.close()

    this.msgInstance = ElMessage({
      type: 'warning',
      message: msg,
      showClose: true,
    })
  }

  success(msg: string) {
    log.info('', msg)
    if (this.msgInstance != null)
      this.msgInstance.close()

    this.msgInstance = ElMessage({
      type: 'success',
      message: msg,
      showClose: true,
    })
  }

  error(msg: string) {
    console.error('', msg)
    if (this.msgInstance != null)
      this.msgInstance.close()

    this.msgInstance = ElMessage({
      type: 'error',
      message: msg,
      showClose: true,
    })
  }
}

export const message = new Message()
