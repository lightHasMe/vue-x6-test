import type { Model } from '@antv/x6'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface IlayoutStore {
  getName: () => string
  getGraphData: () => Model.FromJSONData
  getId: () => string
  setName: (name: string) => void
  setId: (id: string) => void
  setGraphData: (graphData: Model.FromJSONData) => void
}

export const layoutStore = defineStore('layoutStore', () => {
  const name = ref('')
  const id = ref('')
  const graphData = ref<Model.FromJSONData>()

  function getName() {
    return name.value
  }

  function setName(data: string) {
    name.value = data
  }

  function getId() {
    return id.value
  }

  function setId(data: string) {
    id.value = data
  }

  function getGraphData() {
    return graphData.value
  }

  function setGraphData(data: Model.FromJSONData) {
    graphData.value = data
  }

  return { getName, setName, getId, setId, getGraphData, setGraphData } as IlayoutStore
})
