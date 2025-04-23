<template lang="html">
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
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { graphStore } from '../store/graph'
import type { Graph } from '@antv/x6';
import { layoutStore } from '../store/layout';
import { layoutOverallStore } from '../store/layout-overall';

let graph: Graph | undefined

// 当前选中的节点
const selectedNode: any = null

onMounted(() => {
  graph = graphStore().get();
})

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
  }, 500)
}

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


</script>
<style lang="css" scoped>
  
</style>