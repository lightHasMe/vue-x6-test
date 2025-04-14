import mitt from 'mitt'

interface Events {
  nodeAlter: boolean
  createGraph: number
  switchCanvas: string
  changeDisableUp: boolean
  isEditCanvas: boolean
  isChange: boolean
  createClose: boolean
  tmplCreateClose: boolean
  [key: string]: unknown // 字符串索引签名
  [key: symbol]: unknown // 添加 symbol 类型的索引签名
}

const emitter = mitt<Events>()

export default emitter
