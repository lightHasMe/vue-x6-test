import type { EdgeView, Node } from '@antv/x6'
import { ToolsView } from '@antv/x6'
import { ElCol, ElMenu, ElMessage, ElRow, ElTooltip } from 'element-plus'
import { h, render } from 'vue'
import menuCss from '.././menu-css.module.css'
import fontAdd from '.././svg/font-add.vue'
import fontContre from '.././svg/font-contre.vue'
import fontDown from '.././svg/font-down.vue'
import fontMinus from '.././svg/font-minus.vue'
import fontUp from '.././svg/font-up.vue'
import fontLeftUp from '.././svg/font-left-up.vue'
import fontLevel from '.././svg/font-level.vue'
import fontVertical from '.././svg/font-vertical.vue'

// 自定义上下文菜单工具类，继承自 ToolsView.ToolItem
export class SingleMenuTool extends ToolsView.ToolItem<EdgeView, SingleMenuTool> {
  private timer: number = 0 // 定时器，用于控制菜单关闭的延迟
  private node!: Node
  private knob!: HTMLDivElement

  // 鼠标按下事件处理
  private onMouseDown = () => {
    this.timer = window.setTimeout(() => {
      // 设置定时器，200ms 后关闭菜单
      this.toggleContextMenu(false)
    }, 200)
  }

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement
      this.knob.style.position = 'absolute'
      this.container.appendChild(this.knob)
    }
    return this
  }

  // 切换上下文菜单的可见性
  private toggleContextMenu(visible: boolean, e?: MouseEvent, _nod?: Node) {
    document.removeEventListener('mousedown', this.onMouseDown)

    // 清空之前渲染的菜单
    render(null, this.container)
    // 移除鼠标按下事件监听
    // document.removeEventListener('mousedown', this.onMouseDown)
    if (visible && e) {
      // 如果需要显示菜单
      const menuContent = h(
        ElMenu,
        {
          style: {
            position: 'fixed',
            top: `${e.clientY + 10}px`, // 菜单距离鼠标上下10px
            left: `${e.clientX + 10}px`, // 菜单距离鼠标左右10px
            width: '170px',
            Background: 'rgba(255,255,255,0.9)',
            zIndex: 9999,
          },
          onClick: (event: MouseEvent) => {
            event.stopPropagation() // 阻止事件传播
          },
        },
        [
          h('div', { class: menuCss.menuButton }, [
            h(ElRow, null, [
              h(ElCol, { span: 6 }, [
                h(
                  ElTooltip,
                  {
                    content: '字体变大',
                    hideAfter: 20,
                    placement: 'top',
                  },
                  [
                    h(fontAdd, {
                      class: menuCss.buttBig,
                      onClick: () => {
                        this.fontSizeAdd()
                      },
                    }),
                  ],
                ),
              ]),
              h(ElCol, { span: 6 }, [
                h(
                  ElTooltip,
                  {
                    content: '字体变小',
                    hideAfter: 20,
                    placement: 'top',
                  },
                  [
                    h(fontMinus, {
                      class: menuCss.buttBig,
                      onClick: () => {
                        this.fontSizeMinus()
                      },
                    }),
                  ],
                ),
              ]),
            ]),
            h(
              ElRow,
              {
                style: {
                  marginTop: '10px',
                },
              },
              [
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '边框上方文字',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontUp, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontDireUp()
                        },
                      }),
                    ],
                  ),
                ]),
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '边框下方文字',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontDown, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontDireDown()
                        },
                      }),
                    ],
                  ),
                ]),
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '居中文字',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontContre, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontDireContre()
                        },
                      }),
                    ],
                  ),
                ]),
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '文字左上角',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontLeftUp, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontLeftUp()
                        },
                      }),
                    ],
                  ),
                ]),
              ],
            ),
            h(
              ElRow,
              {
                style: {
                  marginTop: '10px',
                },
              },
              [
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '垂直显示',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontVertical, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontVertical()
                        },
                      }),
                    ],
                  ),
                ]),
                h(ElCol, { span: 6 }, [
                  h(
                    ElTooltip,
                    {
                      content: '水平显示',
                      hideAfter: 20,
                      placement: 'bottom',
                    },
                    [
                      h(fontLevel, {
                        class: menuCss.buttBig,
                        onClick: () => {
                          this.fontLevel()
                        },
                      }),
                    ],
                  ),
                ]),
              ],
            ),
            h(
              ElRow,
              {
                style: {
                  marginTop: '10px',
                },
              },
              [
                h(ElCol, { span: 24 }, [
                  h(ElButton, {
                    class: menuCss.button,
                    onClick: () => {
                      this.fontCrosswise()
                    },
                  },
                  '文字横向显示',
                  ),
                ]),
                h(ElCol, { span: 24 }, [
                  h(ElButton, {
                    class: menuCss.button,
                    onClick: () => {
                      this.fontUpright()
                    },
                  },
                  '文字直立',
                  ),
                ]),
                h(ElCol, { span: 24 }, [
                  h(ElButton, {
                    class: menuCss.button,
                    onClick: () => {
                      this.fontSpin90()
                    },
                  },
                  '文字旋转90度',
                  ),
                ]),
              ],
            ),
          ]),
        ],
      ) // 在这里将 add 添加到 div 中
      // 渲染菜单
      render(menuContent, this.container)
      // //添加鼠标按下事件监听
      // document.addEventListener('mousedown', this.onMouseDown)
    }

    document.addEventListener('mousedown', this.onMouseDown)
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob.style
    if (e) {
      const pos = this.graph.clientToGraph(e.clientX, e.clientY)
      style.left = `${pos.x}px`
      style.top = `${pos.y}px`
    }
    else {
      style.left = '-1000px'
      style.top = '-1000px'
    }
  }

  // 上下文菜单事件处理
  private onContextMenu({ e, node }: { e: MouseEvent; node: Node }) {
    this.node = node

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = 0
    }
    this.updatePosition(e)
    this.toggleContextMenu(true, e)
  }

  // 委托事件，将上下文菜单事件绑定到单元视图
  delegateEvents() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.cellView.on('cell:contextmenu', this.onContextMenu, this)
    return super.delegateEvents()
  }

  // 移除工具时清理事件监听
  protected onRemove() {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.cellView.off('cell:contextmenu', this.onContextMenu, this)
  }

  public fontSizeAdd = () => {
    if (this.node != null && this.node.getAttrs().text.text !== '') {
      let size = this.node.getAttrs().text.fontSize as number

      if (size < 30) {
        size++
      }
      else {
        ElMessage({
          message: '已经是最大值了',
          type: 'error',
          plain: true,
        })
      }

      this.node.setAttrs({
        text: {
          fontSize: size,
        },
      })
    }
  }

  public fontSizeMinus = () => {
    if (this.node != null && this.node.getAttrs().text.text !== '') {
      let size = this.node.getAttrs().text.fontSize as number

      if (size > 1) {
        size--
      }
      else {
        ElMessage({
          message: '已经是最小值了',
          type: 'error',
          plain: true,
        })
      }

      this.node.setAttrs({
        text: {
          fontSize: size,
        },
      })
    }
  }

  public fontDireUp = () => {
    if (this.node != null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          refX: '0.5',
          refY: '0', // 这里设置为 130% 是为了将文本移到节点外部底部
          refY2: -12,
          textAnchor: 'middle', // 保证水平居中
          textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
        },
      })
    }
  }

  public fontDireDown = () => {
    if (this.node != null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          refX: '0.5',
          refY: '100%',
          refY2: 6,
          textAnchor: 'middle', // 保证水平居中
          textVerticalAnchor: 'top', // 保证文本从顶部开始显示
        },
      })
    }
  }

  public fontDireContre = () => {
    if (this.node != null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          refX: '0.5',
          refY: '50%',
          refY2: 0,
          textAnchor: 'middle', // 保证水平居中
          textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
        },
      })
    }
  }

  // 文字垂直显示
  public fontVertical = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          style: {
            writingMode: 'vertical-rl',
          },
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }

  // 文字水平显示
  public fontLevel = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          style: {
            writingMode: 'horizontal-tb',
          },
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }

  // 文字横向显示
  public fontCrosswise = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          style: {
            textOrientation: 'mixed',
          },
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }

  // 文字直立
  public fontUpright = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          style: {
            textOrientation: 'upright',
          },
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }

  // 文字旋转90度
  public fontSpin90 = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          style: {
            textOrientation: 'sideways',
          },
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }

  // 文字左上角显示
  public fontLeftUp = () => {
    if (this.node !== null && this.node.getAttrs().text.text !== '') {
      this.node.setAttrs({
        label: {
          refX: '3',
          refY: '3',
          // refY2: -12,
          textAnchor: 'left', // 保证水平居中
          textVerticalAnchor: 'top', // 保证文本从顶部开始显示
        },
      })
      this.node.setData({
        variable: false,
      })
    }
  }
}
