<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteLayout } from '../api/api'
import { getEqpInfo, getGraphDataByAreaId, getLineInfo, getPortInfo, getUnitInfo } from '../api/Home'
import LayoutEdit from '../components/editlayout.vue'
// import type { AreaType } from '../router/interface'
import { dataStore } from '../store/data'
import { graphStore } from '../store/graph'
import { layoutStore } from '../store/layout'
import { layoutOverallStore } from '../store/layout-overall'
import { storeyStore } from '../store/store'
import emitter from '../utils/event-bus'
import { useLogger } from '@/utils/log'
import Trx from '@/components/SqlTable/Trx.vue'
import type TrxType from '@/components/SqlTable/Trx.vue'
import List from '@/components/SqlTable/List.vue'
import type ListType from '@/components/SqlTable/List.vue'
import type { TableInfoType } from '@/components/SqlTable/api/interfaces'

const props = withDefaults(defineProps<{
  route: string
}>(), {
  route: '/guicomm-line',
})

const { t } = useI18n()

const log = useLogger('UserManage')
const listRef = ref<InstanceType<typeof ListType>>()
const trxRef = ref<InstanceType<typeof TrxType>>()
const targetTable = ref('list')
const data = reactive<{
  selectedKey: number
  // area: AreaType
  tableInfo: TableInfoType
  showUserManage: boolean
  showUserAdd: boolean
}>({
  /**
   * 管理员的key是0
   */
  selectedKey: -1,
  tableInfo: {
    formKey: 0,
    columns: [],
    searchColumns: [],
  },
  showUserManage: false,
  showUserAdd: false,
})
// const onMstKeySelected = (key: string) => {
//   data.selectedKey = parseInt(key)
// }
const onManageUserClick = (row: any) => {
  data.showUserManage = true
  data.selectedKey = row.KEY
  // data.area.key = row.KEY
  // data.area.areaId = row.AREA_ID
  // data.area.areaName = row.AREA_NAME
  // data.area.areaDesc = row.AREA_DESC
  // data.area.areaLocation = row.AREA_LOCATION
}

const onDeleteUserClick = (row: any) => {
  const Key = row.KEY
  deleteLayout(Key).then(() => {
    listRef.value!.refresh()
  })
}

// 获取产线和设备的相关信息
const gainLineEqp = async () => {
  await getLineInfo().then((request: any) => {
    dataStore().setLine(request)
  })
  await getEqpInfo().then((request: any) => {
    dataStore().setEqp(request)
  })
  await getPortInfo().then((request: any) => {
    dataStore().setPort(request)
  })
  await getUnitInfo().then((request: any) => {
    dataStore().setUnit(request)
  })
}

// 点击修改
const onSelectItem = async (e: number) => {
  log.info('onSelectItem:', e)
  data.selectedKey = e

  emitter.emit('changeDisableUp', false)
  // layoutStore().setName(data.area.areaName)
  // layoutStore().setId(data.area.areaId)

  // await getGraphDataByAreaId(data.area.areaId)?.then((request: any) => {
  //   layoutOverallStore().setFontDire(request.fontDire)
  //   layoutOverallStore().setFontShow(request.fontShow)
  //   layoutOverallStore().setFontSize(request.fontSize)
  //   layoutOverallStore().fontColor = (request.fontColor ?? '#000000')

  //   import('@/views/crud-manage/components/Create.vue').then(() => {
  //     emitter.emit('isChange', false)

  //     graphStore().get().drawBackground(request.graphBackground)
  //     request.graphBackground.opacity *= 100.0
  //     layoutOverallStore().setLayoutBackground(request.graphBackground)
  //   })

  //   request.cells.forEach((element: any) => {
  //     element.tools = [
  //       {
  //         name: 'contextmenu',
  //       },
  //     ]
  //   })

  // layoutStore().setGraphData(request)
  // })

  gainLineEqp()
}

const tabChange = (tabName: any) => {
  targetTable.value = tabName
}
const onEditSuccess = () => {
  data.showUserManage = false
  data.showUserAdd = false
  listRef.value!.refresh()
  storeyStore().del()
}

const openCreate = () => {
  layoutStore().setName(`1${t('edit.canvas')}`)
  layoutStore().setGraphData([])
  layoutStore().setId('')

  import('@/views/crud-manage/components/Create.vue').then(() => {
    emitter.emit('isChange', true)
  })
  gainLineEqp()

  data.showUserAdd = true
}

onMounted(() => {
  emitter.on('createClose', onEditSuccess)
})
</script>

<template>
  <div>
    <div>
      <el-tabs v-model="targetTable" type="border-card" @tab-change="tabChange">
        <el-tab-pane name="list" :label="$t('table.tab.list')" class="config-tab-pane">
          <List ref="listRef" :route="route" @select-mst-key="onSelectItem">
            <template #buttons>
              <el-button icon="Plus" type="primary" @click="openCreate">
                {{ $t('button.add') }}
              </el-button>
            </template>
            <template #columns>
              <el-table-column :label="$t('userManage.column.operations')" fixed="right" width="140">
                <template #default="{ row }">
                  <el-button icon="Edit" @click="onManageUserClick(row)" />
                  <el-popconfirm :title="$t('sys.userManage.sureDelete')" @confirm="onDeleteUserClick(row)">
                    <template #reference>
                      <el-button icon="Delete" type="danger" />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </template>
          </List>
        </el-tab-pane>
        <el-tab-pane
          name="trx"
          :label="$t('table.tab.history')"
          :disabled="!(data.selectedKey > -1 && trxRef?.isHistoryAvaliable() === null)"
          class="config-tab-pane"
        >
          <template #label>
            <el-tooltip :content="trxRef?.isHistoryAvaliable() || ''" :disabled="!trxRef?.isHistoryAvaliable()">
              {{ $t('table.tab.history') }}
            </el-tooltip>
          </template>
          <Trx ref="trxRef" :route="`${route}_trx`" :show="targetTable === 'trx'" :key-value="data.selectedKey" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <!-- <LayoutEdit
        :area="data.area"
        :show="data.showUserManage"
        @cancel="data.showUserManage = false"
        @ok="onEditSuccess"
      /> -->
      <!-- <LayoutEdit :show="data.showUserAdd" @cancel="data.showUserAdd = false" @ok="onEditSuccess" /> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-tabs--border-card {
  border: none;
  box-shadow: var(--el-box-shadow-light);
  border-radius: var(--el-border-radius-base);
}

.el-tabs--border-card :deep(.el-tabs__header) {
  user-select: none;
  background-color: #f5f5f5;
  border-bottom: none;
  border-top-left-radius: var(--el-border-radius-base);
  border-top-right-radius: var(--el-border-radius-base);
}

.el-tabs--border-card :deep(.el-tabs__item.is-active) {
  border: 1px solid transparent;
}

.el-tabs--border-card :deep(.el-tabs__nav-wrap) {
  border-top-left-radius: var(--el-border-radius-base);
  border-top-right-radius: var(--el-border-radius-base);
}

.config-tab-pane {
  padding: 5px;
}

.config-tab-pane-add {
  width: 80%;
}
</style>
