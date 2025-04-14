import { defineStore } from 'pinia'
import { ref } from 'vue'

export const optionStore = defineStore('optionStore', () => {
  const displayOption = ref([
    {
      name: '颜色显示',
      value: 'color',
    },
    {
      name: '文本显示',
      value: 'text',
    },
  ])

  const selectOption = ref([
    {
      label: 'equipment',
      value: 'equipment',
    },
    {
      label: 'port',
      value: 'port',
    },
    {
      label: 'unit',
      value: 'unit',
    },
  ])

  return { displayOption, selectOption }
})
