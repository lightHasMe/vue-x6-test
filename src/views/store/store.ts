import type { Model } from '@antv/x6'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAreaId } from '../api/Home'
import { Canvases } from '../models/Canvases'

export const storeyStore = defineStore('storeyStore', () => {
  // 有那些层
  const CanvasesList = ref<Canvases[]>([])
  // 当前在哪一层
  const now = ref<string>('')

  const addCanvases = (id: string, storey: string) => {
    CanvasesList.value.push(new Canvases(id, storey))
  }

  const add = (data: Canvases) => {
    CanvasesList.value.push(data)
  }

  const set = (data: Canvases[]) => {
    CanvasesList.value = data
  }

  const getList = () => {
    return CanvasesList.value
  }

  const get = (id: string) => {
    return CanvasesList.value.find(e => e.id === id) ?? null
  }
  const updateGraphData = (id: string, graphData: Model.FromJSONData) => {
    const temp = get(id)
    if (temp != null)
      temp.graphData = graphData
  }

  const getNow = () => {
    return now.value
  }

  const updateNow = (data: string) => {
    now.value = data
  }

  const updateInfo = (id: string, info: string) => {
    const temp = get(id)
    if (temp != null)
      temp.storey = info
  }

  const lastRemove = () => {
    CanvasesList.value.pop()
  }

  const clear = async (canvasName: string) => {
    CanvasesList.value = []

    await getAreaId().then((res) => {
      add(new Canvases(res, canvasName))
      updateNow(CanvasesList.value[0].id)
    })
  }

  const del = () => {
    CanvasesList.value = []
    now.value = ''
  }

  const delById = (id: string) => {
    CanvasesList.value = CanvasesList.value.filter(item => item.id !== id)

    if (now.value === id)
      now.value = CanvasesList.value[0].id
  }

  return {
    getList,
    get,
    getNow,
    updateNow,
    addCanvases,
    add,
    set,
    updateGraphData,
    updateInfo,
    lastRemove,
    clear,
    del,
    delById,
  }
})
