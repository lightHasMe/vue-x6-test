<template lang="html">
  <div class="app-content">
    <div id="container"></div>
    <TeleportContainer />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted } from 'vue'
import ProgressNode from '@/views/components/components/ProgressNode.vue'
import { Graph } from '@antv/x6'
import { register, getTeleport } from '@antv/x6-vue-shape'

register({
  shape: 'custom-vue-node',
  width: 500,
  height: 500,
  component: ProgressNode,
})
const TeleportContainer = getTeleport()

onMounted(() => {
  const graph = new Graph({
    container: document.getElementById('container')!,
    background: {
      color: '#fff',
    },
    autoResize: true,
  })

  graph.addNode({
    shape: 'custom-vue-node',
    x: 100,
    y: 60,
  })
})
</script>
<style lang="css" scoped>
.app-content{
  width: 500px;
  height: 500px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
}
#container {
  width: 500px;
  height: 400px;
  background-color: #005fb8;
}
</style>