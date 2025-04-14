<script setup lang="ts">
import type { Node } from '@antv/x6'
import { ref, watch } from 'vue'
import { graphStore } from '../../store/graph'
import { layoutOverallStore } from '../../store/layout-overall'

const loading = ref(false)

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeoutId: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// 通用节点更新函数（可抽取为公共方法）
const batchUpdateNodes = (updater: (node: Node) => void) => {
  const graphData = graphStore().get()

  graphData.startBatch('update-nodes')
  try {
    const nodes = graphData.getNodes()
    let i = 0
    const total = nodes.length

    const updateChunk = () => {
      const chunkSize = 100 // 每帧处理节点数
      const end = Math.min(i + chunkSize, total)

      for (; i < end; i++)
        updater(nodes[i])

      if (i < total)
        requestAnimationFrame(updateChunk)
      else
        loading.value = false // 全部完成后关闭loading
    }

    requestAnimationFrame(updateChunk)
  }
  finally {
    setTimeout(() => {
      graphData.stopBatch('update-nodes')
      loading.value = false
    }, 0)
  }
}

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

/**
 * 更改节点字体大小
 */
watch(
  () => layoutOverallStore().fontSize,
  (newData: number) => {
    graphStore()
      .get()
      .getNodes()
      .forEach((node) => {
        node.setAttrs({
          text: {
            fontSize: newData,
          },
        })
      })
  },
)

/**
 * 更改竖直模式
 */
watch(
  () => layoutOverallStore().fontGeneralArr,
  (newData: string) => {
    graphStore()
      .get()
      .getNodes()
      .forEach((node) => {
        node.setAttrs({
          label: {
            style: {
              writingMode: newData,
            },
          },
        })
      })
  },
)

/**
 * 更改竖直模式
 */
watch(
  () => layoutOverallStore().fontArr,
  (newData: string) => {
    graphStore()
      .get()
      .getNodes()
      .forEach((node) => {
        node.setAttrs({
          label: {
            style: {
              textOrientation: newData,
            },
          },
        })
      })
  },
)

/**
 * 更改方向
 */
watch(
  () => layoutOverallStore().fontDire,
  (newData: string) => {
    graphStore()
      .get()
      .getNodes()
      .forEach((item: Node) => {
        switch (newData) {
          case 'top': {
            item.setAttrs({
              label: {
                refX: '0.5',
                refY: '0', // 这里设置为 130% 是为了将文本移到节点外部底部
                refY2: -12,
                textAnchor: 'middle', // 保证水平居中
                textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
              },
            })
            break
          }
          case 'middle': {
            item.setAttrs({
              label: {
                refX: '0.5',
                refY: '50%',
                refY2: 0,
                textAnchor: 'middle', // 保证水平居中
                textVerticalAnchor: 'middle', // 保证文本从顶部开始显示
              },
            })
            break
          }
          case 'bottom': {
            item.setAttrs({
              label: {
                refX: '0.5',
                refY: '100%',
                refY2: 6,
                textAnchor: 'middle', // 保证水平居中
                textVerticalAnchor: 'top', // 保证文本从顶部开始显示
              },
            })
            break
          }
        }
      })
  },
)

/**
 * 设置显不显示文字
 */
watch(
  () => layoutOverallStore().fontShow,
  (newData: any) => {
    graphStore()
      .get()
      .getNodes()
      .forEach((node: Node) => {
        if (newData) {
          const temp = node.data.text
          node.setAttrs({
            text: {
              text: temp,
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
      })
  },
)

/**
 * 设置文字颜色
 */
watch(
  () => layoutOverallStore().fontColor,
  (newData: any) => {
    loading.value = true
    debounce(() => {
      batchUpdateNodes((node) => {
        node.attr('label/fill', newData, { silent: true }) // 静默更新
      })
    }, 300)
  },
)
</script>

<template lang="html">
  <div v-loading="loading">
    <el-form label-width="auto" style="max-width: 600px">
      <el-form-item :label="$t('edit.setting.oneLocation')">
        <el-select v-model="layoutOverallStore().fontDire">
          <el-option :label="$t('edit.setting.oneLocationUp')" value="top" />
          <el-option :label="$t('edit.setting.oneLocationCentre')" value="middle" />
          <el-option :label="$t('edit.setting.oneLocationDown')" value="bottom" />
        </el-select>
      </el-form-item>
      <el-form-item label="竖排模式">
        <el-select v-model="layoutOverallStore().fontGeneralArr">
          <el-option label="水平方向" value="horizontal-tb" />
          <el-option label="竖直方向" value="vertical-rl" />
        </el-select>
      </el-form-item>
      <el-form-item label="文字直立">
        <el-select v-model="layoutOverallStore().fontArr">
          <el-option label="横向显示" value="mixed" />
          <el-option label="直立显示" value="upright" />
          <el-option label="文字旋转90" value="sideways" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('edit.setting.oneSize')">
        <el-input-number v-model="layoutOverallStore().fontSize" :min="1" :max="30" />
      </el-form-item>
      <el-form-item :label="$t('edit.setting.oneShow')">
        <el-select v-model="layoutOverallStore().fontShow">
          <el-option :label="$t('edit.setting.oneShowY')" :value="true" />
          <el-option :label="$t('edit.setting.oneShowN')" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('edit.setting.fontColor')">
        <el-color-picker v-model="layoutOverallStore().fontColor" show-alpha :predefine="predefineColors" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="css" scoped></style>
