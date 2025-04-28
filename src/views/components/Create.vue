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
import Cylinder from '@/shapes/cylinder.vue'
import Rect from '@/shapes/rect.vue'
import Circle from '@/shapes/circle.vue'
import AIChatInterface from '../../components/AIChatInterface.vue'
import { register } from '@antv/x6-vue-shape'
import Tool from './tool.vue'
import Meter from '@/shapes/meter.vue'
import Switch from '@/shapes/switch.vue'

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

    const nodeAttrs: any = {
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
    }

    return graph.createNode({
      width: w,
      height: h,
      shape,
      label: '',
      // attrs: nodeAttrs,
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
      console.log(node)
      break
    case 'circle':
      node = addShapeNode(60, 60, 'circle')
      break
    case 'cylinder':
      node = addShapeNode(60, 100, 'cylinder')
      break
    case "meter":
      node = addShapeNode(150, 150, 'meter')
      break;
    case "switch":
      node = addShapeNode(100, 100, 'switch')
      break;
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

// 根据AI指令创建节点
const createNodeFromAI = (type: string, properties: any = {}) => {
  if (!graph || !dnd) return null;
  
  let node = null;
  const {
    width = 100, 
    height = 100, 
    position = { x: 100, y: 100 },
    // label = 'sdsda',
    attrs = {},
    data = {}
  } = properties;

  const addShapeNode = (w: number, h: number, shape: string) => {
    if (!graph) return null

    const nodeAttrs: any = {
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
    }

    // 为圆形添加特殊属性
    if (shape === 'circle') {
      nodeAttrs.body = {
        ...nodeAttrs.body,
        r: Math.min(w, h) / 2,
        cx: w / 2,
        cy: h / 2
      }
    }

    return graph.createNode({
      width: w,
      height: h,
      shape,
      label: '',
      attrs: nodeAttrs,
      data: {
        disableMove: false,
        name: '',
        display: '',
        value: '',
        text: '',
      } as NodeDataInfo,
    })
  }
  
  // 根据类型创建基础节点
  switch (type) {
    case 'rect':
      node = addShapeNode(width, height, 'rect');
      break;
    case 'circle':
      node = addShapeNode(width, height, 'circle');
      // 设置圆形节点的特殊属性
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
    default:
      console.warn('未知节点类型:', type);
      return null;
  }
  
  // 应用自定义属性
  if (node) {
    // 设置位置
    node.position(position.x, position.y);
    
    // 设置标签
    // if (label) {
      node.attr('text/text', "sdada");
    // }

    // 设置节点数据
    if (data) {
      const currentData = node.getData() || {};
      node.setData({
        ...currentData,
        ...data
      });
    }

    if(attrs){
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

function shapeRegister(){
  register({
    shape: 'cylinder', 
    component: Cylinder,
    width: 120,
    height: 120,
  })
  register({
    shape: "switch",
    component: Switch,
    width: 120,
    height: 120,
  })
  register({
    shape: "meter",
    component: Meter,
    width: 120,
    height: 120,
    attrs: {
      text: {
        text: '',
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        textAnchor: 'middle',
        fill: '#000000'
      }
    }
  })
} 

// 初始化画布
onMounted(() => {
  graph = Create() as Graph

  graphStore().set(graph)

  shapeRegister()

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

  
  // 暴露方法到全局
  exposeMethodsToAI();
})
</script>

<template lang="html">
  <div v-loading="loading" class="common-layout">
    <Tool></Tool>
    <el-container class="main">
      <el-aside class="dnd">
        <div ref="dndContainer" class="no-select">
          <el-collapse accordion>
            <el-collapse-item class="item" :title="$t('edit.kind.one')" name="1">
              <div class="shape">
                <Rect @mousedown="startDrag" />
                <Circle @mousedown="startDrag" />
                <Cylinder @mousedown="startDrag" />
                <Meter @mousedown="startDrag" />
                <Switch @mousedown="startDrag" style="height: 100px;width: 100px;" />
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
  height: 93vh;
  /* overflow: hidden; */
}

.pattern {
  background-color: antiquewhite;
}

.save {
  margin-left: 13px;
  width: 110px !important;
}


.shape {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: center;
  justify-items: center;
  padding: 10px;
  width: 300px;
}

.dnd {
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
}

.dndFoot {
  margin-top: auto;
  display: flex;
}
.no-select {
  user-select: none; /* 适用于大多数现代浏览器 */
  -webkit-user-select: none; /* 适用于 Safari */
  -moz-user-select: none; /* 适用于 Firefox */
  -ms-user-select: none; /* 适用于 IE/Edge */
}
</style>
