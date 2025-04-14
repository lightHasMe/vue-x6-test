<script setup lang="ts"></script>

<template lang="html">
  <div class="triangle" />
</template>

<style lang="css" scoped>
.triangle {
  width: 100px;
  height: 100px;
  border: 2px solid black; /* 黑色的边框 */
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%); /* 用剪裁路径形成三角形 */
  background-color: hotpink; /* 确保中间没有颜色填充 */
}
</style>
