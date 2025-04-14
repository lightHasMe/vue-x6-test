import type { EdgeView, Node } from '@antv/x6'
import { ToolsView } from '@antv/x6'
import { ElMenu } from 'element-plus'
import { h, render } from 'vue'
import menuCss from '.././menu-css.module.css'
import { dataStore } from '../../../store/data'
import { getLinePhoto } from '../../../api/Home'
import { graphStore } from '../../../store/graph'
import { layoutOverallStore } from '../../../store/layout-overall'

interface RestaurantItem {
  id: string
  value: string
}

const state = ref('')
const restaurants = ref<RestaurantItem[]>([])

export class MultipleMenuTool extends ToolsView.ToolItem<EdgeView, MultipleMenuTool> {
  private timer = 0 // 定时器，用于控制菜单关闭的延迟
  private nodes: Node[] = [] // 存储选中的节点
  private knob: HTMLDivElement | undefined

  // 鼠标按下事件处理
  private readonly onMouseDown = () => {
    this.timer = window.setTimeout(() => {
      // 设置定时器，200ms 后关闭菜单
      this.toggleContextMenu(false)
    }, 200)
  }

  render () {
    if (this.knob == null) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }
    return this
  }

  // 切换上下文菜单的可见性
  public toggleContextMenu (visible: boolean, e?: MouseEvent, nodes?: Node[]) {
    document.removeEventListener('mousedown', this.onMouseDown)

    render(null, this.container) // 清空之前渲染的菜单
    if (visible && (e != null)) {
      // 渲染菜单
      const menuContent = h(
        ElMenu,
        {
          style: {
            position: 'fixed',
            top: `${e.clientY + 10}px`,
            left: `${e.clientX + 10}px`,
            width: '190px',
            background: 'rgba(255,255,255,0.9)',
            zIndex: 9999,
          },
          onClick: (event: Event) => {
            event.stopPropagation() // 阻止事件传播
          },
        },
        [
          h('div', null, [
            h('ul', { class: menuCss.infiniteList, style: { overflow: 'auto' } }, [
              restaurants.value.map(item =>
                h(
                  'li',
                  {
                    class: menuCss.infiniteListLtem,
                    key: item.id,
                    onClick: async () => {
                      await this.handleSelect(item)
                    },
                  },
                  item.value,
                ),
              ),
            ]),
          ]),
        ],
      )
      render(menuContent, this.container)

      // 添加鼠标按下事件监听
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  // 更新菜单的位置
  private updatePosition (e?: MouseEvent) {
    const style = this.knob?.style
    if (style != null) {
      if (e != null) {
        const pos = this.graph.clientToGraph(e.clientX, e.clientY)
        style.left = `${pos.x}px`
        style.top = `${pos.y}px`
      }
      else {
        style.left = '-1000px'
        style.top = '-1000px'
      }
    }
  }

  // 上下文菜单事件处理
  private onContextMenu ({ e }: { e: MouseEvent }) {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }

    // 获取最新的选中节点
    e.preventDefault() // 阻止默认右键菜单
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.nodes = this.graph.getSelectedCells() as Node[]

    if (this.nodes.length === 0)
      return

    const data: RestaurantItem[] = []
    dataStore().productionLine.forEach((res) => {
      const temp: RestaurantItem = {
        id: res.line_id,
        value: res.line_name,
      }
      data.push(temp)
    })

    restaurants.value = data
    state.value = ''

    // 确保最新的节点值在右键点击时被使用
    this.toggleContextMenu(true, e, this.nodes)
    this.updatePosition(e)
  }

  // 监听事件，将上下文菜单事件绑定到单元视图
  delegateEvents () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.cellView.on('cell:contextmenu', this.onContextMenu, this)
    return super.delegateEvents()
  }

  // 移除工具时清理事件监听
  protected onRemove () {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.cellView.off('cell:contextmenu', this.onContextMenu, this)
  }

  querySearch = (queryString: string, cb: (items: RestaurantItem[]) => void) => {
    const results = queryString ? restaurants.value.filter(this.createFilter(queryString)) : restaurants.value
    cb(results)
  }

  createFilter = (queryString: string) => {
    return (restaurant: RestaurantItem) => {
      return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    }
  }

  handleSelect = async (item: RestaurantItem) => {
    clearTimeout(this.timer) // 清除定时器

    // 获取产线Key
    const lineId = item.id

    // 根据产线ID获取产线图片
    let linePhoto = ''
    await getLinePhoto(lineId).then((res) => {
      linePhoto = res
    })

    // 产线可以之间贴图就行
    // 设备和端口得先保存下来
    const eqpNodeList: Node[] = []
    const portNodeList: Node[] = []
    this.nodes.forEach((node: Node) => {
      switch (node.getData<{ type: string }>().type) {
        case 'line': {
          let lineNode = null as Node | null

          if (linePhoto === '') {
            lineNode = graphStore()
              .get()
              .createNode({
                shape: node.shape,
                x: node.getPosition().x,
                y: node.getPosition().y,
                width: node.getSize().width,
                height: node.getSize().height,
                zIndex: node.getZIndex(),
                attrs: {
                  body: {
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    fill: '#fff',
                  },
                  label: {
                    fill: '#000',
                    refX: '0.5',
                    refY: '0.5',
                    textAnchor: 'middle', // 保证水平居中
                    textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
                  },
                  text: {
                    fill: '#000000',
                    fontFamily: 'Arial, helvetica, sans-serif',
                    fontSize: 14,
                    refX: 0.5,
                    refY: 0.5,
                    text: '',
                  },
                },
                data: {
                  disableMove: false,
                  eqpId: '',
                  portId: '',
                  lotId: '',
                  recipeId: '',
                  lineId,
                  text: '',
                },
              })
          }
          else {
            lineNode = graphStore()
              .get()
              .createNode({
                shape: 'image',
                x: node.getPosition().x,
                y: node.getPosition().y,
                width: node.getSize().width,
                height: node.getSize().height,
                attrs: {
                  image: {
                    'xlink:href': linePhoto,
                  },
                },
                zIndex: node.getZIndex(),
                data: {
                  disableMove: false,
                  eqpId: '',
                  portId: '',
                  lineId,
                  text: '',
                },
                tools: [
                  {
                    name: 'contextmenu',
                  },
                ],
              })
          }

          graphStore().get().addNode(lineNode)
          graphStore().get().removeNode(node)
          break
        }
        case 'eqp': {
          eqpNodeList.push(node)
          break
        }
        case 'port': {
          portNodeList.push(node)
          break
        }
      }
    })

    this.createEqpNode(eqpNodeList, lineId)
    this.createPortNode(portNodeList, lineId)
  }

  public selectLine = (item: RestaurantItem) => {
    return item
  }

  createEqpNode (nodes: Node[], lineId: string) {
    nodes.sort((node1: Node, node2: Node) => {
      return node1.getData<{ num: number }>().num - node2.getData<{ num: number }>().num
    })

    let i = 0
    const eqpList = dataStore().eqps.filter(eqp => eqp.line_id === lineId)
    nodes.forEach((node) => {
      if (i < eqpList.length) {
        const newEqpNode = graphStore()
          .get()
          .createNode({
            shape: node.shape,
            x: node.getPosition().x,
            y: node.getPosition().y,
            width: node.getSize().width,
            height: node.getSize().height,
            zIndex: node.getZIndex(),
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
              label: {
                fill: '#000',
                refX: '0.5',
                refY: '0.5',
                textAnchor: 'middle', // 保证水平居中
                textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
              },
              text: {
                fill: '#000000',
                fontFamily: 'Arial, helvetica, sans-serif',
                fontSize: 14,
                refX: 0.5,
                refY: 0.5,
                text: eqpList[i].eqp_name,
              },
            },
            data: {
              disableMove: false,
              eqpId: eqpList[i].eqp_id,
              portId: '',
              lotId: '',
              recipeId: '',
              lineId,
              text: eqpList[i].eqp_name,
            },
          })

        layoutOverallStore().setNode(newEqpNode as Node<{ data: { text: string } }>)

        graphStore().get().removeNode(node)
        graphStore().get().addNode(newEqpNode)
        i++
      }
      else {
        graphStore().get().removeNode(node)
      }
    })
  }

  createPortNode (nodes: Node[], lineId: string) {
    nodes.sort((node1: Node, node2: Node) => {
      return node1.getData<{ num: number }>().num - node2.getData<{ num: number }>().num
    })

    let i = 0
    const portList = dataStore().ports.filter(port => port.line_id === lineId)
    nodes.forEach((node) => {
      if (i < portList.length) {
        const newEqpNode = graphStore()
          .get()
          .createNode({
            shape: node.shape,
            x: node.getPosition().x,
            y: node.getPosition().y,
            width: node.getSize().width,
            height: node.getSize().height,
            zIndex: node.getZIndex(),
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
              label: {
                fill: '#000',
                refX: '0.5',
                refY: '0.5',
                textAnchor: 'middle', // 保证水平居中
                textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
              },
              text: {
                fill: '#000000',
                fontFamily: 'Arial, helvetica, sans-serif',
                fontSize: 14,
                refX: 0.5,
                refY: 0.5,
                text: portList[i].port_name,
              },
            },
            data: {
              disableMove: false,
              eqpId: '',
              portId: portList[i].port_id,
              lotId: '',
              recipeId: '',
              lineId,
              text: portList[i].port_name,
            },
          })

        layoutOverallStore().setNode(newEqpNode as Node<{ data: { text: string } }>)

        graphStore().get().removeNode(node)
        graphStore().get().addNode(newEqpNode)
        i++
      }
      else {
        graphStore().get().removeNode(node)
      }
    })
  }
}
