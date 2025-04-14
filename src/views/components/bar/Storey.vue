<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, defineProps, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getAreaId } from '../../api/Home'
import { storeyStore } from '../../store/store'
import emitter from '../../utils/event-bus'

const props = defineProps({
  affect: {
    type: Boolean,
    required: true,
  },
})

const { t } = useI18n()

const store = storeyStore()
const editingIndex = ref<number | null>(null)
const editValue = ref<string>('')

const storeyList = computed(() => store.getList())
// 是否编辑画布
const isEditCanves = ref<boolean>(false)

// 检查是否处于编辑模式
const isEditing = (index: number) => {
  if (props.affect !== false)
    return index === editingIndex.value
}

// 双击开始编辑
const startEditing = (index: number) => {
  if (props.affect !== false) {
    editingIndex.value = index
    editValue.value = store.getList()[index].storey
  }
}

// 保存编辑
const saveEdit = (index: number) => {
  if (editingIndex.value === index && props.affect !== false) {
    store.updateInfo(store.getList()[index].id, editValue.value)
    editingIndex.value = null
    editValue.value = ''
  }
}

// 设置按钮背景颜色
const getButtonType = (index: number) => {
  return `${index}` === store.getNow() ? 'info' : ''
}

// 聚焦指定层
const focus = (id: string) => {
  store.updateNow(id)
  emitter.emit('switchCanvas', id)
}

// 添加新层
const add = async () => {
  const len = storeyStore().getList().length
  await getAreaId().then((request: any) => {
    store.addCanvases(request.data, `${len + 1}${t('edit.canvas')}`)
  })
}

const removeStorey = (id: string) => {
  const len = storeyStore().getList().length

  if (len > 1) {
    ElMessageBox.confirm(t('delConfirm.content'), t('delConfirm.title'), {
      distinguishCancelAndClose: true,
      confirmButtonText: t('delConfirm.yesButton'),
      cancelButtonText: t('delConfirm.noButton'),
    }).then(() => {
      storeyStore().delById(id)
      ElMessage.success(t('delConfirm.yes'))
      isEditCanves.value = false
    })
  }
  else {
    ElMessage.error(t('delConfirm.err'))
  }
}

onMounted(() => {
  emitter.on('isEditCanvas', (data: boolean) => {
    isEditCanves.value = data
  })
})
</script>

<template lang="html">
  <div style="padding: 10px">
    <template v-for="(storey, index) in storeyList" :key="storey.id">
      <el-badge
        v-if="isEditCanves"
        value="x"
        :offset="[-10, 0]"
        class="delCanevas"
        @click="removeStorey(storey.id)"
      >
        <el-button
          v-if="!isEditing(index)"
          :type="getButtonType(index)"
          style="margin-right: 10px"
          plain
          @click="focus(storey.id)"
          @dblclick="startEditing(index)"
        >
          {{ storey.storey }}
        </el-button>
      </el-badge>

      <el-button
        v-if="!isEditing(index)"
        :type="getButtonType(index)"
        style="margin-right: 10px"
        :color="storeyStore().getNow() === storey.id ? '#409eff' : ''"
        plain
        @click="focus(storey.id)"
        @dblclick="startEditing(index)"
      >
        {{ storey.storey }}
      </el-button>

      <el-button
        v-else-if="isEditCanves"
        :type="getButtonType(index)"
        style="margin-right: 10px"
        :color="storeyStore().getNow() === storey.id ? '#409eff' : ''"
        plain
        @click="focus(storey.id)"
        @dblclick="startEditing(index)"
      >
        {{ storey.storey }}
      </el-button>

      <el-input
        v-if="isEditing(index)"
        v-model="editValue"
        :style="{ width: '100px' }"
        @blur="saveEdit(index)"
        @keyup.enter="saveEdit(index)"
      />
    </template>

    <template v-if="props.affect && !isEditCanves">
      <el-button @click="add">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
          />
        </svg>
      </el-button>
    </template>
  </div>
</template>

<style lang="css" scoped>
@keyframes shake {
  0% {
    transform: translate(0.5px, 0.5px) rotate(0deg);
  }

  10% {
    transform: translate(-0.5px, -1px) rotate(-0.5deg);
  }

  20% {
    transform: translate(-1.5px, 0px) rotate(0.5deg);
  }

  30% {
    transform: translate(1.5px, 1px) rotate(0deg);
  }

  40% {
    transform: translate(0.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-0.5px, 1px) rotate(-0.5deg);
  }

  60% {
    transform: translate(-1.5px, 0.5px) rotate(0deg);
  }

  70% {
    transform: translate(1.5px, 0.5px) rotate(-0.5deg);
  }

  80% {
    transform: translate(-0.5px, -0.5px) rotate(0.5deg);
  }

  90% {
    transform: translate(0.5px, 1px) rotate(0deg);
  }

  100% {
    transform: translate(0.5px, -1px) rotate(-0.5deg);
  }
}

.delCanevas {
  display: inline-block;
  animation: shake 0.7s;
  /* 调整后的动画时间 */
  animation-iteration-count: infinite;
  cursor: pointer;
  user-select: none;
}
</style>
