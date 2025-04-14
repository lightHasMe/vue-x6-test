import type { Graph } from '@antv/x6'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const graphStore = defineStore('graphStore', () => {
  const graph = ref<Graph>()

  function get () {
    return graph.value
  }

  function set (graphData: Graph) {
    graph.value = graphData
  }

  return { get, set }
})
