<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template lang="html">
  <div data-type="rect" class="dnd-rect">
    {{ props.text }}
  </div>
</template>

<style lang="css" scoped>
.dnd-rect {
  height: 30px !important;
  width: 90px !important;
  border: 2px solid black !important;
  background-color: white !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
