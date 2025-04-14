<template lang="html">
  <div class="device-node">
    <div class="label">{{ label || '未命名设备' }}</div>
    <div class="brand">品牌: {{ brand || '未知' }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';

const label = ref('')
const brand = ref('')

const getNode = inject('getNode') as () => any

onMounted(() => {
  const node = getNode()
  label.value = node.data.label
  brand.value = node.data.brand
});
</script>

<style lang="css" scoped>
.device-node {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 12px;
}

.label {
  font-weight: bold;
  margin-bottom: 5px;
}

.brand {
  color: #0066cc;
}
</style>