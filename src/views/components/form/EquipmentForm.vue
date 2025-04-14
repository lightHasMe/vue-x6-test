<script lang="ts" setup>
import { Node } from '@antv/x6'
import { defineProps, onMounted, ref, watch } from 'vue'
import { optionStore } from '../../store/option'

interface NodeDataInfo {
  name: string
  display: string
  value: string
  text: string
  disableMove: boolean
}

const props = defineProps({
  node: {
    type: Node<{ data: NodeDataInfo }>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeDrawer() {
  emit('close') // 触发关闭事件
}

const form = ref<NodeDataInfo>({
  name: '',
  display: '',
  value: '',
  text: '',
  disableMove: false,
})

const state = ref(false)

const querySearch = (queryString: string, cb: (results: any[]) => void) => {
  const results = queryString
    ? optionStore().selectOption.filter(item => item.label.toLowerCase().includes(queryString.toLowerCase()))
    : optionStore().selectOption
  cb(results)
}

const handleSelect = (item: any) => {
  form.value.name = item.value
}

const saveNode = () => {
  props.node.setData(form.value)
  const textValue = form.value.text && form.value.text !== ''
    ? form.value.text
    : form.value.value && form.value.value !== ''
      ? form.value.value
      : form.value.name || ''
  props.node.setAttrs({ text: { text: textValue } })

  closeDrawer()
}

function upForm() {
  setTimeout(() => {
    form.value.name = props.node.getData().name
  }, 1)
  setTimeout(() => {
    form.value.display = props.node.getData().display
  }, 100)

  if (props.node.getData().value || props.node.getData().text)
    state.value = true

  setTimeout(() => {
    form.value.value = props.node.getData().value
  }, 100)
  setTimeout(() => {
    form.value.text = props.node.getData().text
  }, 100)

  watch(
    () => form.value.name,
    (newId) => {
      form.value.display = ''
      form.value.value = ''
      form.value.text = ''
      if (optionStore().selectOption.some(item => item.value === newId)) {
        state.value = true
        form.value.display = 'color'
      }
      else {
        state.value = false
      }
    },
  )
}

onMounted(() => {
  upForm()
})
</script>

<template>
  <div style="width: 100%; height: 100%;">
    <div style="display: flex; flex-direction: column; height: 90%">
      <el-form :model="form" label-width="auto" style="max-width: 600px" class="no-select">
        <el-form-item label="选项">
          <el-autocomplete
            v-model="form.name"
            :fetch-suggestions="querySearch"
            placeholder="请选择"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="样式">
          <el-select v-model="form.display" :placeholder="$t('edit.energize.display')" :disabled="!form.name">
            <el-option v-for="option in optionStore().displayOption" :key="option.name" :value="option.value" :label="option.name" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="state" label="颜色">
          <el-input
            v-model="form.value"
            type="text"
            :placeholder="请选择"
            :disabled="!form.display"
          />
        </el-form-item>
        <el-form-item v-if="state" label="文本">
          <el-input
            v-model="form.text"
            type="textarea"
            placeholder="备注描述"
          />
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-left: 80%;" class="no-select" @click="saveNode">
      <el-button type="primary">
        保存
      </el-button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.no-select {
  user-select: none; /* 适用于大多数现代浏览器 */
  -webkit-user-select: none; /* 适用于 Safari */
  -moz-user-select: none; /* 适用于 Firefox */
  -ms-user-select: none; /* 适用于 IE/Edge */
}

.el-input input,
.el-input textarea,
.el-autocomplete input {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

</style>
