import type { Model } from '@antv/x6'

export class Canvases {
  public id: string
  public storey: string
  public graphData: Model.FromJSONData

  constructor (id: string, storey: string, graphData: Model.FromJSONData = {}) {
    this.id = id
    this.storey = storey
    this.graphData = graphData // 如果没有传递 graphData 参数，则默认设置为空对象
  }
}
