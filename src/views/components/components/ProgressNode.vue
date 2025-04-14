<template lang="html">
  <el-progress type="dashboard" :percentage="percentage" :width="80">
    <template #default="{ percentage }">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

const getNode = inject('getNode') as () => any
const percentage = ref(90)

onMounted(() => {
  const node = getNode()
  console.log(node)
})
</script>