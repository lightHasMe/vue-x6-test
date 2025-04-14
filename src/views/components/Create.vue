<script setup lang="ts">
import type { Node } from '@antv/x6'
import { Graph, NumberExt } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Export } from '@antv/x6-plugin-export'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Transform } from '@antv/x6-plugin-transform'
import { getTeleport } from '@antv/x6-vue-shape'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref, watch, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAreaId, getTmplDataByTmplId, uplodeFile } from '../api/Home'
import { graphStore } from '../store/graph'
import { layoutStore } from '../store/layout'
import { layoutOverallStore } from '../store/layout-overall'
import { storeyStore } from '../store/store'
import emitter from '../utils/event-bus'
import type { NodeDataInfo } from '../models/NodeDataInfo'
import Setting from './bar/setting.vue'
import EquipmentForm from './form/EquipmentForm.vue'
import Circle from './shape/Circle.vue'
import Ellipse from './shape/Ellipse.vue'
import Rect from './shape/Rect.vue'
import Square from './shape/square.vue'
import Cylinder from './shape/cylinder.vue'
import AIChatInterface from '../../components/AIChatInterface.vue'
import test from './xflow/test1.vue'
import { register } from '@antv/x6-vue-shape'

const { t } = useI18n()

const TeleportContainer = defineComponent(getTeleport())
// 这里表示graph 变量的类型可以是Graph或者null
let graph: Graph | null = null
// 拖拽实例
let dnd: Dnd | null = null
// 左边拖动挂载dom节点
const dndContainer = ref<HTMLDivElement | null>(null)
// 画布挂载dom节点
const container = ref<HTMLElement | null>(null)
// 双击表单抽屉状态
const FormState = ref(false)
// 双击传递节点数据
const nodeData = ref()
// 是否保存
const nodeAlter = ref(false)
// 当前选中的节点
const selectedNode: any = null
// 是否正在编辑
const isEdit = ref(false)
// 是否正在修改
const isChange = ref(true)
// 加载的开关
const loading = ref(false)
// 添加AI聊天界面状态
const showAIChat = ref(false)

// 监听画布节点数据变化
watch(
  () => layoutStore().getGraphData(),
  (newValue) => {
    if (graph)
      graph.fromJSON(newValue)
  },
)

// 向下对齐
const alignDown = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let maxY = Number.MIN_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        const realY = node.position().y + node.size().height
        if (realY > maxY)
          maxY = realY
      })

      selectedCells.forEach((node: any) => {
        node.position(node.position().x, maxY - node.size().height)
      })
    }
  }
}

// 向上对齐
const alignUp = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let minY = Number.MAX_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        const realY = node.position().y
        if (realY < minY)
          minY = realY
      })

      selectedCells.forEach((node: any) => {
        node.position(node.position().x, minY)
      })
    }
  }
}

// 居中对齐
const alignCenter = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let maxY = Number.MIN_SAFE_INTEGER
      let minY = Number.MAX_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        const realY1 = node.position().y + node.size().height
        const realY2 = node.position().y

        maxY = realY1 > maxY ? realY1 : maxY
        maxY = realY2 > maxY ? realY2 : maxY

        minY = realY1 < minY ? realY1 : minY
        minY = realY2 < minY ? realY2 : minY
      })

      const realCenter = (maxY - minY) / 2.0 + minY

      selectedCells.forEach((node: any) => {
        node.position(node.position().x, realCenter - node.size().height / 2.0)
      })
    }
  }
}

// 垂直居中
const verticalCenter = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let maxX = Number.MIN_SAFE_INTEGER
      let minX = Number.MAX_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        const realX1 = node.position().x + node.size().width
        const realX2 = node.position().x

        maxX = realX1 > maxX ? realX1 : maxX
        maxX = realX2 > maxX ? realX2 : maxX

        minX = realX1 < minX ? realX1 : minX
        minX = realX2 < minX ? realX2 : minX
      })

      const realCenter = (maxX - minX) / 2.0 + minX

      selectedCells.forEach((node: any) => {
        node.position(realCenter - node.size().width / 2.0, node.position().y)
      })
    }
  }
}

// 向左对齐
const alignLeft = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let minX = Number.MAX_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        minX = node.position().x < minX ? node.position().x : minX
      })

      selectedCells.forEach((node: any) => {
        node.position(minX, node.position().y)
      })
    }
  }
}

// 向右对齐
const alignRight = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 1) {
      let maxX = Number.MIN_SAFE_INTEGER

      selectedCells.forEach((node: any) => {
        const realX = node.position().x + node.getSize().width

        maxX = realX > maxX ? realX : maxX
      })

      selectedCells.forEach((node: any) => {
        node.position(maxX - node.size().width, node.position().y)
      })
    }
  }
}

// 删除节点
const DelNode = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()
    if (selectedCells.length > 0) {
      selectedCells.forEach((cell) => {
        if (cell.isNode() && graph) graph?.removeNode(cell)
      })
    }
  }
}

// 获取最左上角的节点的坐标
const getLeftTopNodePosition = () => {
  const nodes = graph?.getNodes()

  const minPosition = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER,
  }

  nodes?.forEach((node: any) => {
    const position = node.position()

    if (position.x < minPosition.x)
      minPosition.x = position.x
    if (position.y < minPosition.y)
      minPosition.y = position.y
  })

  return minPosition
}

// 上传服务器，生成一个JSON格式的文件，然后将这个文件上传至服务器端
const Save = async () => {
  loading.value = true
  if (graph === null)
    return

  const formData = {} as {
    LineId: string
    LineName: string
    LineDesc: string
    LineLocation: string
    LinePhoto: string
  }

  formData.LineId = layoutStore().getId()
  formData.LineName = layoutStore().getName()

  const bbox = getLeftTopNodePosition()

  // 创建画布JSOn文件对象
  const jsonString = JSON.stringify(graph?.toJSON())

  const tempData = JSON.parse(jsonString)

  tempData.cells.forEach((node: any) => {
    node.position.x -= bbox.x // 更新x坐标
    node.position.y -= bbox.y // 更新y坐标
    node.tools = {}
  })

  const temp = {
    ...tempData,
    graphBackground: layoutOverallStore().getLayoutBackground(),
    fontSize: layoutOverallStore().getFontSize(),
    fontShow: layoutOverallStore().getFontShow(),
    fontDire: layoutOverallStore().getFontDire(),
    fontColor: layoutOverallStore().fontColor,
  }

  const realJsonString = JSON.stringify(temp)


  // //创建画布JPEG文件对象
  graph?.toJPEG(
    (dataUri: string) => {
      // 使用解码后的二进制数据创建 Blob

    },
    { quality: 1, backgroundColor: '#ffffff', padding: 10 },
  )

  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 上层展示
const StratumUp = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells() ?? []

    // 获取当前所有节点的最大 zIndex
    const allNodes = graph.getNodes()
    const maxZIndex = Math.max(...allNodes.map(node => node.getZIndex() || 0), 0)

    if (selectedCells.length > 0) {
      selectedCells.forEach((cell) => {
        if (cell.isNode()) cell.setZIndex(maxZIndex + 1)
      })
    }
    else if (selectedNode) {
      selectedNode.setZIndex(maxZIndex + 1)
    }
  }
}
// 下层展示
const StratumDown = () => {
  if (graph) {
    const selectedCells = graph.getSelectedCells()

    // 获取当前所有节点的最小 zIndex
    const allNodes = graph.getNodes()
    const minZIndex = Math.min(...allNodes.map((node: any) => node.getZIndex() || 0), 0)

    if (selectedCells.length > 0) {
      selectedCells.forEach((cell: any) => {
        if (cell.isNode()) cell.setZIndex(minZIndex - 1)
      })
    }
    else if (selectedNode) {
      selectedNode.setZIndex(minZIndex - 1)
    }
  }
}

// 关闭窗口
const handleClose = (done: () => void) => {
  if (nodeAlter.value) {
    ElMessageBox.confirm(t('edit.saveNode.title'))
      .then(() => {
        // 确认保存
        emitter.emit('upNode')
        graph?.removeNode(nodeData.value)

        done()
      })
      .catch(() => {
        // 不保存
        FormState.value = false
      })
  }
  else {
    FormState.value = false
  }
}

// 拖动创建的代码
const startDrag = (e: MouseEvent) => {
  if (!graph || !dnd) return

  const target = e.currentTarget as HTMLDivElement
  const type = target.getAttribute('data-type')

  const addShapeNode = (w: number, h: number, shape: string) => {
    if (!graph) return null

    return graph.createNode({
      width: w,
      height: h,
      shape,
      label: '',
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
        name: '',
        display: '',
        value: '',
        text: '',
      } as NodeDataInfo,
    })
  }

  let node = null
  switch (type) {
    case 'rect':
      node = addShapeNode(100, 40, 'rect')
      break
    case 'circle':
      node = addShapeNode(60, 60, 'circle')
      break
    case 'ellipse':
      node = addShapeNode(80, 40, 'ellipse')
      break
    case 'square':
      node = addShapeNode(50, 50, 'rect')
      break
    case 'cylinder':
      node = addShapeNode(48, 74, 'cylinder')
      node?.setAttrs({
        top: {
          fill: '#ffffff',
          fillOpacity: 0.5,
        },
        body: {
          fill: '#ffffff',
          fillOpacity: 0.8,
        },
      })
      break
  }

  if (node) {
    layoutOverallStore().setNode(node as Node<{ data: NodeDataInfo } >)
    dnd.start(node, e)
  }
}

// 添加用于AI交互的方法
const handleAICommand = (command: string) => {
  console.log(command)

  try {
    const arrayNode = JSON.parse(command);

    arrayNode.forEach((parsedCommand: any) => {
      if (parsedCommand.action === 'createNode') {
        const { type, properties } = parsedCommand;
        
        // 根据AI指令创建节点
        createNodeFromAI(type, properties);
      }
      if (parsedCommand.action === 'changeNode') {
        const { properties, type } = parsedCommand;
        const nodeId = properties.id;
        const targetNode = graph?.getCellById(nodeId);
        
        if (targetNode && targetNode.isNode()) {
          // 更新位置
          if (properties.position) {
            targetNode.position(properties.position.x, properties.position.y);
          }
          
          // 更新大小
          if (properties.width && properties.height) {
            targetNode.resize(properties.width, properties.height);
          }
          
          // 更新属性
          if (properties.attrs) {
            targetNode.setAttrs(properties.attrs);
          }
          
          // 更新数据
          if (properties.data) {
            targetNode.setData({...targetNode.getData(), ...properties.data});
          }
        }
      }
    });
    
  } catch (error) {
    console.error('AI命令解析错误:', error);
    return { success: false, message: '命令格式错误' };
  } finally {
    // 添加成功反馈到消息中
    return { success: true, message: '节点创建成功' };
  }
}

const addShapeNode = (w: number, h: number, shape: string) => {
    if (!graph) return null

    return graph.createNode({
      width: w,
      height: h,
      shape,
      label: '',
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
        name: '',
        display: '',
        value: '',
        text: '',
      } as NodeDataInfo,
    })
  }

// 根据AI指令创建节点
const createNodeFromAI = (type: string, properties: any = {}) => {
  if (!graph || !dnd) return null;
  
  let node = null;
  const {
    width = 100, 
    height = 100, 
    position = { x: 100, y: 100 },
    label = '',
    attrs = {},
    data = {}
  } = properties;
  
  // 根据类型创建基础节点
  switch (type) {
    case 'rect':
      node = addShapeNode(width, height, 'rect');
      break;
    case 'circle':
      node = addShapeNode(width, height, 'circle');
      break;
    case 'ellipse':
      node = addShapeNode(width, height, 'ellipse');
      break;
    case 'square':
      node = addShapeNode(width, height, 'rect');
      break;
    case 'cylinder':
      node = addShapeNode(width, height, 'cylinder');
      node?.setAttrs({
        top: {
          fill: '#ffffff',
          fillOpacity: 0.5,
        },
        body: {
          fill: '#ffffff',
          fillOpacity: 0.8,
        },
      });
      break;
    case 'device':
      // 创建设备节点
      node = graph.createNode({
        shape: 'device-node',
        width: width,
        height: height,
        data: {
          label: data.label || label || '设备节点',
          brand: data.brand || '未知品牌',
          ...data
        },
      });
      break;
    default:
      console.warn('未知节点类型:', type);
      return null;
  }
  
  // 应用自定义属性
  if (node) {
    // 设置位置
    node.position(position.x, position.y);
    
    // 设置标签
    if (label && type !== 'device') {
      node.attr('text/text', label);
    }

    // 设置节点数据
    if (data && type !== 'device') {
      const currentData = node.getData() || {};
      node.setData({
        ...currentData,
        ...data
      });
    }

    if(attrs && type !== 'device'){
      node.setAttrs(attrs);
    }
    
    // 将节点添加到画布
    if (graph) {
      graph.addNode(node);
      graph.cleanSelection();
      graph.select(node);
    }
    
    return node;
  }
  
  return null;
}

// 暴露方法到全局，以便AI可以调用
const exposeMethodsToAI = () => {
  window.MCPAI = {
    createNode: (type: string, properties: any) => createNodeFromAI(type, properties),
    handleCommand: handleAICommand
  };
}

// 初始化画布
const Create = () => {
  if (!dndContainer.value || !container.value) return

  graph = new Graph({
    container: container.value,
    width: 1504,
    height: 773,
    panning: {
      enabled: true,
      modifiers: 'ctrl',
      eventTypes: ['leftMouseDown'],
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
    },
    scaling: {
      min: 0.5,
      max: 10,
    },
    background: {
      color: 'rgb(249, 249, 249)',
    },
    grid: {
      visible: true,
      size: 1,
      type: 'mesh',
      args: {
        color: '#eee', // 主网格线颜色
        thickness: 10, // 主网格线宽度
      },
    },
    translating: {
      restrict: true,
    },
  })

  // 监听节点的点击事件
  graph.on('node:dblclick', ({ node }: any) => {
    FormState.value = true
    nodeData.value = node
  })

  // 监听节点的单击事件
  graph.on('node:click', ({ node, e }: any) => {
    console.log(node.attr())
  })

  // 监听节点的删除事件
  graph.on('node:removed', ({ node }: any) => {
    storeyStore().updateGraphData(storeyStore().getNow(), graph?.toJSON() ?? {})
  })

  // 监听节点的修改事件
  graph.on('node:change:*', ({ node }: any) => {
    storeyStore().updateGraphData(storeyStore().getNow(), graph?.toJSON() ?? {})
  })

  const selection = new Selection({
    // 框选工具
    enabled: true, // 是否启用这个框选工具
    multiple: true, // 允许多选
    rubberband: true, // 启用橡皮筋框选模式
    movable: true, // 允许移动选中节点
    showNodeSelectionBox: true, // 显示选中节点的边框
    strict: true, // 严格框选
  })

  const history = new History({
    // 插销重做
    enabled: true,
  })

  const keyBoard = new Keyboard({
    enabled: true,
    global: false, // 改为 false，让事件只在画布范围内生效
  })

  const fileExport = new Export() // 导出

  const clipboard = new Clipboard({
    // 复制粘贴
    enabled: true,
  })

  const snaplien = new Snapline({
    // 对齐线
    enabled: true,
    clean: false, // 不清楚对齐线 （可以自定义清除时间）
    resizing: true, // 改变大小触发对齐线
    tolerance: 1, // 对齐精度小于tolerance时触发
  })

  const transform = new Transform({
    // 图形变形
    resizing: {
      enabled: true,
      minWidth: 1, // 最小宽度
      minHeight: 1, // 最小高度
      // maxWidth: 500, // 最大宽度
      // maxHeight: 500, // 最大高度
      restrict: false, // 不可以超出画布边缘
      autoScroll: true, // 拖动位置超过画布自动滚动画布
      allowReverse: false,
    },
    rotating: {
      // 旋转
      enabled: true,
      grid: 10, // 没次旋转10度
    },
  })

  dnd = new Dnd({
    target: graph, // 目标画布
    scaled: false, //
    dndContainer: dndContainer.value,
  })

  graph.use(selection)
  graph.use(history)
  graph.use(keyBoard)
  graph.use(fileExport)
  graph.use(clipboard)
  graph.use(snaplien)
  graph.use(transform)

  // 修改键盘事件绑定方式
  graph.bindKey(['ctrl+c', 'command+c'], (e: KeyboardEvent) => { // 同时支持 ctrl 和 command
    e.preventDefault() // 阻止默认行为
    const cells = graph?.getSelectedCells()
    if (graph && cells?.length) graph.copy(cells)
    return false
  })

  graph.bindKey(['ctrl+v', 'command+v'], (e: KeyboardEvent) => {
    e.preventDefault()
    if (graph && !graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
  })

  graph.bindKey(['ctrl+z', 'command+z'], (e: KeyboardEvent) => {
    e.preventDefault()
    if (graph) graph.undo()
  })

  graph.bindKey(['ctrl+y', 'command+y'], (e: KeyboardEvent) => {
    e.preventDefault()
    if (graph) graph.redo()
  })

  graph.bindKey('delete', (e: KeyboardEvent) => {
    e.preventDefault()
    emitter.emit('delNodes')
  })

  graph.bindKey(['ctrl+a', 'command+a'], (e: KeyboardEvent) => {
    if (!graph) return
    e.preventDefault()
    const allNodes = graph.getNodes()
    graph.select(allNodes)
  })

  graph.bindKey(['ctrl+s', 'command+s'], (e: KeyboardEvent) => {
    e.preventDefault()
    Save()
  })

  return graph
}

function onClose() {
  FormState.value = false // 直接关闭
}

// 初始化画布
onMounted(() => {
  emitter.on('switchCanvas', (index: string) => {
    const graphData = storeyStore().get(index).graphData
    if (graph) graph.fromJSON(graphData)
  })
  emitter.on('isChange', (data: boolean) => {
    isChange.value = data
  })

  graph = Create() as Graph

  graphStore().set(graph)

  graph.fromJSON(layoutStore().getGraphData() ?? {})

  container.value?.addEventListener('dragover', (event: DragEvent) => {
    event.preventDefault()
  })

  // 监听Layout模版拖拽放置
  graph.container.addEventListener('drop', (event: DragEvent) => {
    event.preventDefault()
    // 获取模版ID
    const tmplId = event.dataTransfer?.getData('tmplId')
    if (tmplId) {
      // 根据模版ID获取模版数据
      getTmplDataByTmplId(tmplId).then((res: any) => {
        const cells = res.cells
        // 判断最小值
        let minX = Number.MAX_VALUE
        let minY = Number.MAX_VALUE

        cells.forEach((node: any) => {
          if (node.position.x < minX)
            minX = node.position.x

          if (node.position.y < minY)
            minY = node.position.y
        })

        cells.forEach((node: any) => {
          node.position.x -= minX
          node.position.y -= minY
        })

        // 根据
        cells.forEach((cell: any) => {
          cell.id = ''
          cell.position.x += event.offsetX
          cell.position.y += event.offsetY
        })

        graph?.cleanSelection()

        cells.forEach((node: any) => {
          const data = graph?.createNode(node)
          graph?.addNode(data as Node)
          graph?.select(data as Node)
        })
      })
    }
  })

  // // 监听节点的添加事件
  graph.on('node:added', ({ node }) => {
    if (graph)
      storeyStore().updateGraphData(storeyStore().getNow(), graph.toJSON() ?? {})
  })

  // 注册自定义 Vue 节点
  register({
    shape: 'device-node', 
    component: test,
    width: 120,
    height: 120,
  })

  // 添加设备节点
  graph.addNode({
    id: '1',
    shape: 'device-node', 
    x: 100,
    y: 100,
    width: 120,
    height: 120,
    data: {
      label: '在线（Q13UDV）',
      brand: '三菱',
    },
  })

  // 暴露方法到全局
  exposeMethodsToAI();
})
</script>

<template lang="html">
  <div v-loading="loading" class="common-layout">
    <el-tooltip effect="dark" :content="$t('edit.button.upload')">
      <el-button @click="Save">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          class="bi bi-database-up"
          viewBox="0 0 18 18"
        >
          <path
            fill-rule="evenodd"
            d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.354-5.854a.5.5 0 0 0-.708 0l-1.5 1.5a.5.5 0 0 0 .708.708l.646-.647V14.5a.5.5 0 0 0 1 0v-2.793l.646.647a.5.5 0 0 0 .708-.708l-1.5-1.5Z"
          />
          <path
            fill-rule="evenodd"
            d="M12.096 6.223A4.92 4.92 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.493 4.493 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.525 4.525 0 0 1-.813-.927C8.5 14.992 8.252 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.552 4.552 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10c.262 0 .52-.008.774-.024a4.525 4.525 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777ZM3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4Z"
          />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.delete')">
      <el-button @click="DelNode">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-trash"
          viewBox="0 0 16 16"
        >
          <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
          />
          <path
            fill-rule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.up')">
      <el-button @click="StratumUp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"
          />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.down')">
      <el-button @click="StratumDown">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4z"
            fill="white"
            stroke="#606266"
            stroke-width="1"
          />
          <path d="M8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z" fill="#606266" stroke="#606266" stroke-width="1.5" />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.alignDown')">
      <el-button @click="alignDown">
        <svg
          fill="#606266"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M1,21a1,1,0,0,1,1-1H22a1,1,0,0,1,0,2H2A1,1,0,0,1,1,21ZM20,8a1,1,0,0,1,1,1v8a1,1,0,0,1-1,1H14a1,1,0,0,1-1-1V9a1,1,0,0,1,1-1Zm-1,2H15v6h4ZM10,2a1,1,0,0,1,1,1V17a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V3A1,1,0,0,1,4,2ZM9,4H5V16H9Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.alignUp')">
      <el-button @click="alignUp">
        <svg
          fill="#606266"
          height="16"
          width="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M23,3a1,1,0,0,1-1,1H2A1,1,0,0,1,2,2H22A1,1,0,0,1,23,3ZM14,16a1,1,0,0,1-1-1V7a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v8a1,1,0,0,1-1,1Zm1-2h4V8H15ZM3,21V7A1,1,0,0,1,4,6h6a1,1,0,0,1,1,1V21a1,1,0,0,1-1,1H4A1,1,0,0,1,3,21Zm2-1H9V8H5Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.alignCenter')">
      <el-button @click="alignCenter">
        <svg
          fill="#606266"
          height="16"
          width="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M22,11H20V5a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1v6H11V7a1,1,0,0,0-1-1H5A1,1,0,0,0,4,7v4H2a1,1,0,0,0,0,2H4v4a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V13h2v6a1,1,0,0,0,1,1h5a1,1,0,0,0,1-1V13h2a1,1,0,0,0,0-2ZM9,16H6V8H9Zm6,2V6h3V18Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.verticalCenter')">
      <el-button @click="alignLeft">
        <svg
          fill="#606266"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M3,23a1,1,0,0,1-1-1V2A1,1,0,0,1,4,2V22A1,1,0,0,1,3,23ZM6,10V4A1,1,0,0,1,7,3h8a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1H7A1,1,0,0,1,6,10ZM8,9h6V5H8ZM21,21H7a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1H21a1,1,0,0,1,1,1v6A1,1,0,0,1,21,21Zm-1-6H8v4H20Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.alignLeft')">
      <el-button @click="verticalCenter">
        <svg
          fill="#606266"
          height="16"
          width="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M5,13a1,1,0,0,0-1,1v5a1,1,0,0,0,1,1h6v2a1,1,0,0,0,2,0V20h6a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1H13V11h4a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H13V2a1,1,0,0,0-2,0V4H7A1,1,0,0,0,6,5v5a1,1,0,0,0,1,1h4v2ZM8,6h8V9H8ZM18,18H6V15H18Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" :content="$t('edit.button.alignRight')">
      <el-button @click="alignRight">
        <svg
          fill="#606266"
          height="16"
          width="16"
          viewBox="-2.4 -2.4 28.80 28.80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M20,22V2a1,1,0,0,1,2,0V22a1,1,0,0,1-2,0ZM9,11a1,1,0,0,1-1-1V4A1,1,0,0,1,9,3h8a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1Zm1-2h6V5H10ZM3,13H17a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V14A1,1,0,0,1,3,13Zm1,6H16V15H4Z"
            />
          </g>
        </svg>
      </el-button>
    </el-tooltip>

    <el-container class="main">
      <el-aside class="dnd">
        <div ref="dndContainer" class="no-select">
          <el-collapse accordion>
            <el-collapse-item class="item" :title="$t('edit.kind.one')" name="1">
              <div class="shape">
                <Rect @mousedown="startDrag" />
                <Circle @mousedown="startDrag" />
                <Ellipse @mousedown="startDrag" />
                <Square @mousedown="startDrag" />
                <Cylinder @mousedown="startDrag" />
              </div>
            </el-collapse-item>
            <el-collapse-item class="item" :title="$t('edit.kind.two')" name="2">
              <tmplShow />
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="dndFoot">
          <Setting />
          
          <!-- 添加AI聊天界面按钮 -->
          <el-button @click="showAIChat = !showAIChat">
            {{ showAIChat ? '隐藏AI助手' : '显示AI助手' }}
          </el-button>
        </div>
      </el-aside>
      <el-main style="padding: 0px 0px !important; width: auto">
        <div ref="container" style="margin-top: 10px" />
        <TeleportContainer />
      </el-main>
    </el-container>

    <el-drawer
      v-model="FormState"
      :destroy-on-close="true"
      :before-close="handleClose"
      direction="rtl"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template #header />
      <template #default>
        <EquipmentForm :node="nodeData" @close="onClose" />
      </template>
    </el-drawer>

    <!-- 添加AI聊天界面 -->
    <el-drawer
      v-model="showAIChat"
      title="AI图形助手"
      direction="rtl"
      size="30%"
    >
      <AIChatInterface />
    </el-drawer>
  </div>
</template>

<style lang="css" scoped>
.common-layout {
  /* overflow: hidden !important; */
  background-color: white !important;
  border: 0px solid !important;
}

.main {
  height: 86vh;
  /* overflow: hidden; */
}

.pattern {
  background-color: antiquewhite;
}

.save {
  margin-left: 13px;
  width: 110px !important;
}

.dnd-rect,
.dnd-circle {
  margin: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  cursor: pointer;
}

.shape {
  display: grid;
  grid-template-columns: 1fr 3fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
}

.dnd {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
}

.dndFoot {
  margin-top: auto;
}
.no-select {
  user-select: none; /* 适用于大多数现代浏览器 */
  -webkit-user-select: none; /* 适用于 Safari */
  -moz-user-select: none; /* 适用于 Firefox */
  -ms-user-select: none; /* 适用于 IE/Edge */
}
</style>
