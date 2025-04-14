<script setup lang="ts">
import { ref } from 'vue'
import SettingBackground from './setting-background.vue'
import SettingFont from './setting-font.vue'

const show = ref(false)

const activeIndex = ref('1')

const handleSelect = (index: string) => {
  activeIndex.value = index
}
</script>

<template lang="html">
  <div>
    <el-button icon="Setting" plain @click="show = true" />
    <el-dialog
      v-model="show"
      style="padding: 30px; height: 600px; margin: 40px auto"
      width="1200px"
      :destroy-on-close="true"
    >
      <div class="common-layout">
        <el-container>
          <el-aside width="200px">
            <el-scrollbar>
              <el-menu :default-active="activeIndex" @select="handleSelect">
                <el-menu-item index="1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-file-earmark-font marRight"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M10.943 6H5.057L5 8h.5c.18-1.096.356-1.192 1.694-1.235l.293-.01v5.09c0 .47-.1.582-.898.655v.5H9.41v-.5c-.803-.073-.903-.184-.903-.654V6.755l.298.01c1.338.043 1.514.14 1.694 1.235h.5l-.057-2z"
                    />
                    <path
                      d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
                    />
                  </svg>
                  <span>{{ $t('edit.setting.one') }}</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-card-image marRight"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    <path
                      d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"
                    />
                  </svg>
                  <span>{{ $t('edit.setting.two') }}</span>
                </el-menu-item>
              </el-menu>
            </el-scrollbar>
          </el-aside>
          <el-main>
            <SettingFont v-if="activeIndex === '1'" />
            <SettingBackground v-if="activeIndex === '2'" />
          </el-main>
        </el-container>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="css" scoped>
.marRight {
  margin-right: 5px;
}
</style>
