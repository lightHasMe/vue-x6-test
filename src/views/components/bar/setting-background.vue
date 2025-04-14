<script setup lang="ts">
import { Graph } from '@antv/x6'
import { onMounted, ref } from 'vue'
import { graphStore } from '../../store/graph'
import { layoutOverallStore } from '../../store/layout-overall'
import Settings from './setting-background-set.vue'

const containerRef = ref<HTMLDivElement | null>(null)
let graph: Graph | null = null

onMounted(() => {
  if (containerRef.value) {
    graph = new Graph({
      container: containerRef.value,
      height: 380,
      width: 340,
      background: { color: '#F2F7FA' },
    })

    graph.drawBackground(layoutOverallStore().layoutBackground)

    graph.centerContent()

    const source = graph.addNode({
      x: 42,
      y: 42,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = graph.addNode({
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    graph.centerContent()
  }
})

const onBackgroundChanged = (options: Graph.BackgroundManager.Options) => {
  if (graph) {
    graph.drawBackground(options)
    graphStore().get().drawBackground(options)
    // layoutOverallStore().setLayoutBackground(options)
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="450px" style="margin-right: 10px">
        <Settings @change="onBackgroundChanged" />
      </el-aside>
      <el-main style="padding: 0px">
        <div ref="containerRef" class="app-content" />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.background-app {
  display: flex;
}

.app-side {
  width: 200px;
}

.app-content {
  flex: 1;
  height: 600px;
}
</style>
