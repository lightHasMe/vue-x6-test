<script setup lang="ts">
const props = defineProps<{
  width?: number
  height?: number
}>()
</script>

<template lang="html">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    class="bi bi-displayport dnd-port"
    viewBox="0 0 16 16"
    data-type="port"
    :width="`${props.width}px`"
    :height="`${props.height}px`"
  >
    <path
      d="M2.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0V8h10v.5a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5h-11Z"
    />
    <path
      d="M1 5a1 1 0 0 0-1 1v3.191a1 1 0 0 0 .553.894l1.618.81a1 1 0 0 0 .447.105H15a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1Zm0 1h14v4H2.618L1 9.191V6Z"
    />
  </svg>
</template>

<style lang="css" scoped>
.dnd-port {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
