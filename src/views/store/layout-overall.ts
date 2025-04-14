import type { Graph, Node } from '@antv/x6'
import { defineStore } from 'pinia'
import type { NodeDataInfo } from '../models/NodeDataInfo'
import { ref } from 'vue'

export const layoutOverallStore = defineStore('layoutOverallStore', () => {
  const fontDire = ref('middle')
  const fontSize = ref(14)
  const fontShow = ref(true)
  const fontGeneralArr = ref('horizontal-tb')
  const fontArr = ref('mixed')
  const fontColor = ref('#000000')
  const layoutPhoto = ref()
  const layoutBackground = ref<Graph.BackgroundManager.Options>({
    color: '#ffffff',
    repeat: 'no-repeat',
    position: 'center',
    size: 'cover',
    opacity: 1,
    angle: 0,
    image: '',
  })
  const setFontDire = (dire: string | null) => {
    if (dire === null)
      return

    fontDire.value = dire
  }

  const setFontSize = (size: number | null) => {
    if (size === null)
      return

    if (size > 1 && size < 30) fontSize.value = size
  }

  const setFontShow = (show: boolean | null) => {
    if (show === null)
      return

    fontShow.value = show
  }

  const setLayoutBackground = (background: Graph.BackgroundManager.Options) => {
    if (background.opacity != null && background.opacity > 1)
      background.opacity /= 100.0

    layoutBackground.value = background
  }

  const getFontDire = () => {
    return fontDire.value
  }

  const getFontSize = () => {
    return fontSize.value
  }

  const getFontShow = () => {
    return fontShow.value
  }

  const getLayoutBackground = () => {
    return layoutBackground.value
  }

  const fontDireUp = (node: Node<{ data: NodeDataInfo }>) => {
    node.setAttrs({
      label: {
        refX: '0.5',
        refY: '0',
        refY2: -12,
        textAnchor: 'middle', // 保证水平居中
        textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
      },
    })
  }
  const fontDireDown = (node: Node<{ data: NodeDataInfo }>) => {
    node.setAttrs({
      label: {
        refX: '0.5',
        refY: '100%',
        refY2: 6,
        textAnchor: 'middle', // 保证水平居中
        textVerticalAnchor: 'top', // 保证文本从顶部开始显示
      },
    })
  }
  const fontDireContre = (node: Node<{ data: NodeDataInfo }>) => {
    node.setAttrs({
      label: {
        refX: '0.5',
        refY: '50%',
        refY2: 0,
        textAnchor: 'middle', // 保证水平居中
        textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
      },
    })
  }

  // 调整节点
  const setNode = (node: Node<{ data: NodeDataInfo }>) => {
    // 调整文字大小
    node.setAttrs({
      text: {
        fontSize: getFontSize(),
      },
    })

    // node.attr('label/fill', fontColor.value)

    // 调整文字位置
    switch (getFontDire()) {
      case 'top':
        fontDireUp(node)
        break
      case 'bottom':
        fontDireDown(node)
        break
      case 'middle':
        fontDireContre(node)
        break
    }
    // 调整文字是否显示
    if (getFontShow()) {
      let textValue = ''
      if (node.data.text !== null && node.data.text !== '') textValue = node.data.text ?? ''
      else if (node.data.value !== null && node.data.value !== '') textValue = node.data.value ?? ''
      else if (node.data.name !== null && node.data.name !== '') textValue = node.data.name ?? ''
      node.setAttrs({
        text: {
          text: textValue,
        },
      })
    }
    else {
      node.setAttrs({
        text: {
          text: '',
        },
      })
    }

    node.setAttrs({
      label: {
        style: {
          writingMode: fontGeneralArr.value, // 默认竖排模式
          textOrientation: fontArr.value, // 文字直立
        },
      },
    })
  }

  return {
    fontDire,
    fontShow,
    fontSize,
    layoutPhoto,
    layoutBackground,
    fontGeneralArr,
    fontArr,
    fontColor,
    setFontDire,
    setFontSize,
    setFontShow,
    setLayoutBackground,
    getFontDire,
    getFontSize,
    getFontShow,
    getLayoutBackground,
    setNode,
  }
})
