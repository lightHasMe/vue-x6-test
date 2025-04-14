import type { EdgeView, Node } from '@antv/x6'
import { ToolsView } from '@antv/x6'
import { Link } from '@element-plus/icons-vue'
import { ElButton, ElMenu } from 'element-plus'
import { h, render } from 'vue'
import { graphStore } from '../../store/graph'
import menuCss from './menu-css.module.css'
import { useLogger } from '@/utils/log'

const log = useLogger('FunctionTool')

export class ContextMenuTool extends ToolsView.ToolItem<EdgeView, ContextMenuTool> {
  private timer = 0 // 定时器，用于控制菜单关闭的延迟
  private nodes: Node[] = [] // 存储选中的节点
  private knob?: HTMLDivElement = undefined

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
      log.info('显示上下文菜单', e, nodes)

      // 渲染菜单
      const menuContent = h(
        ElMenu,
        {
          style: {
            position: 'fixed',
            top: `${e.clientY + 10}px`,
            left: `${e.clientX + 10}px`,
            width: '170px',
            background: 'rgba(255,255,255,0.9)',
            zIndex: 9999,
          },
          onClick: (event: Event) => {
            event.stopPropagation() // 阻止事件传播
          },
        },
        [
          h('div', { class: menuCss.menu }, [
            h('div', { class: menuCss.dire }, [
              h(
                ElButton,
                {
                  icon: Link,
                  style: { width: '150px' },
                  onClick: (event: MouseEvent) => {
                    event.stopPropagation() // 阻止事件传播
                    this.allSetLine(this.nodes)
                  },
                },
                '产线',
                // t('edit.tmpl.line'),
              ),
            ]),
            h('div', { class: menuCss.dire }, [
              h(
                ElButton,
                {
                  icon: Link,
                  style: { width: '150px' },
                  onClick: (event: MouseEvent) => {
                    event.stopPropagation() // 阻止事件传播
                    this.allSetEqp(this.nodes)
                  },
                },
                '设备',
                // t('edit.tmpl.eqp'),
              ),
            ]),
            h('div', { class: menuCss.dire }, [
              h(
                ElButton,
                {
                  icon: Link,
                  style: { width: '150px' },
                  onClick: (event: MouseEvent) => {
                    event.stopPropagation() // 阻止事件传播
                    this.allSetPort(this.nodes)
                  },
                },
                '端口',
                // t('edit.tmpl.port'),
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

  public allSetLine (nodes: Node[]) {
    let num = this.getNumber('line')

    nodes.forEach((node: Node) => {
      node.setAttrs({
        text: {
          text: '产线',
        },
      })
      node.setData({
        type: 'line',
        num: num++,
      })
    })
  }

  public allSetEqp (nodes: Node[]) {
    let num = this.getNumber('eqp')

    nodes.forEach((node: Node) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (node.getData().type === 'eqp')
        return

      node.setAttrs({
        text: {
          text: `设备${num + 1}`,
        },
      })
      node.setData({
        type: 'eqp',
        num: num++,
      })
    })
  }

  public allSetPort (nodes: Node[]) {
    let num = this.getNumber('port')

    nodes.forEach((node: Node) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (node.getData().type === 'port')
        return

      node.setAttrs({
        text: {
          text: `端口${num + 1}`,
        },
      })
      node.setData({
        type: 'port',
        num: num++,
      })
    })
  }

  public allSetUnit (nodes: Node[]) {
    let num = this.getNumber('unit')

    nodes.forEach((node: Node) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (node.getData().type === 'unit')
        return

      node.setAttrs({
        text: {
          text: `子设备${num + 1}`,
        },
      })
      node.setData({
        type: 'unit',
        num: num++,
      })
    })
  }

  public getNumber (type: string) {
    const num = 0

    // graphStore()
    //   .get()
    //   .getNodes()
    //   .forEach((node: Node) => {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, curly
    //     if (node.getData().type === type) {
    //       num++
    //     }
    //   })

    return num
  }
}
