<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAllEqp } from '../api/api'
import { layoutStore } from '../store/layout'
import emitter from '../utils/event-bus'
import type { LineInfoType } from '../../line/api/interfaces'
import Create from './Create.vue'

// 引入国际化
const props = defineProps<{
  show: boolean
  line?: LineInfoType
}>()// 判断是编辑模式还是添加模式
const emits = defineEmits(['cancel', 'ok'])
const { t } = useI18n()
const mode = computed(() => (props.show ? 'edit' : 'add')) // 定义事件
const data = reactive<{
  line: LineInfoType
  submitting: boolean // 提交状态
}>({
  line: {
    key: -1,
    lineId: '',
    lineName: '',
    lineDesc: '',
    lineLocation: '',
    linePhoto: '',
  },
  submitting: false,
})
// 双击编辑的开关
const isEditing = ref(false)
// 编辑后的内容
const editContent = ref('')
// 编辑的输入框
const editInput = ref<HTMLElement | null>(null)

// 保存编辑之后的内容
const saveContent = () => {
  layoutStore().setName(editContent.value)
  isEditing.value = false
}

// 双击开启编辑模式
const editContentFun = () => {
  isEditing.value = true
  nextTick(() => {
    const inputElement = editInput.value
    inputElement?.focus()
  })
  editContent.value = layoutStore().getName()
}

const createClose = () => {
  emitter.emit('createClose', false)
}

</script>

<template>
  <div>
    <el-dialog
      custom-class="eqpCreate"
      style="margin: 10px auto; padding: 0px 10px !important"
      width="95%"
      :show-close="false"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :model-value="show"
    >
      <template #header="">
        <div class="title">
          <span v-if="!isEditing" @dblclick="editContentFun">{{ layoutStore().getName() }}</span>
          <input
            v-else
            ref="editInput"
            v-model="editContent"
            autofocus
            class="edit-input"
            @blur="saveContent"
            @keyup.enter="saveContent"
          >
          <div @click="createClose">
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </template>

      <Create />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.custom-tree-node-container :deep(.is-button) {
  > .el-tree-node__content {
    color: #626aef; // 自定义树节点的颜色
  }
}
.title {
  display: flex;
  justify-content: center;
  align-items: center !important;
  padding-bottom: 0px !important;
  padding-top: 5px !important;
}

.title span,
.title input {
  margin: 0px auto;
}
.title span {
  cursor: pointer;
  user-select: none;
}
.edit-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  text-align: center;
  width: auto; /* Adjust to content width */
  min-width: 50px; /* Set a minimum width to avoid collapsing */
  display: inline-block;
}
</style>
