<template lang="html">
  <div class="tank-container">
    <div class="tank-svg-wrapper">
      <svg class="tank-svg" viewBox="4 26 200 240" xmlns="http://www.w3.org/2000/svg">
        <!-- 罐体主体 -->
        <path class="tank-body" d="M 40 60 L 40 240 C 40 270 160 270 160 240 L 160 60 C 160 30 40 30 40 60 Z" />
        
        <!-- 罐体顶部 -->
        <ellipse class="tank-top" cx="100" cy="60" rx="60" ry="30" />
        
        <!-- 液体 -->
        <path class="tank-liquid" d="M 40 160 L 40 240 C 40 270 160 270 160 240 L 160 160 C 160 190 40 190 40 160 Z" />
        
        <!-- 液体顶部 -->
        <ellipse class="tank-liquid-top" cx="100" cy="160" rx="60" ry="30" />
        
        <!-- 罐体装饰 -->
        <line x1="40" y1="100" x2="160" y2="100" class="tank-detail" />
        <line x1="40" y1="140" x2="160" y2="140" class="tank-detail" />
        <line x1="40" y1="180" x2="160" y2="180" class="tank-detail" />
        <line x1="40" y1="220" x2="160" y2="220" class="tank-detail" />
        
        <!-- 量度表 -->
        <rect x="170" y="80" width="5" height="160" class="tank-gauge-bg" />
        <rect x="170" y="160" width="5" height="80" class="tank-gauge-level" />
        <line x1="170" y1="80" x2="180" y2="80" class="tank-gauge-tick" />
        <line x1="170" y1="120" x2="180" y2="120" class="tank-gauge-tick" />
        <line x1="170" y1="160" x2="180" y2="160" class="tank-gauge-tick" />
        <line x1="170" y1="200" x2="180" y2="200" class="tank-gauge-tick" />
        <line x1="170" y1="240" x2="180" y2="240" class="tank-gauge-tick" />
        
        <!-- 标签文本 -->
        <text x="185" y="85" class="tank-gauge-text">100%</text>
        <text x="185" y="165" class="tank-gauge-text">50%</text>
        <text x="185" y="245" class="tank-gauge-text">0%</text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'



</script>

<style lang="css" scoped>
.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f7fa;
  height: 100%;
  width: 100%;
  font-family: "Microsoft YaHei", sans-serif;
}

.tank-svg-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.tank-svg {
  width: 100%;
  height: 100%;
}

.tank-body {
  fill: #8cc1ed;
  stroke: #5aa9e6;
  stroke-width: 2;
}

.tank-top {
  fill: #d9e8f5;
  stroke: #5aa9e6;
  stroke-width: 2;
}

.tank-liquid {
  fill: #1a73e8;
  opacity: 0.8;
}

.tank-liquid-top {
  fill: #1a73e8;
  opacity: 0.8;
}

.tank-detail {
  stroke: #5aa9e6;
  stroke-width: 1;
  opacity: 0.5;
}

.tank-pipe {
  fill: #8cc1ed;
  stroke: #5aa9e6;
  stroke-width: 1;
}

.tank-gauge-bg {
  fill: #e6e8eb;
  stroke: #909399;
  stroke-width: 1;
}

.tank-gauge-level {
  fill: #ff9f43;
}

.tank-gauge-tick {
  stroke: #909399;
  stroke-width: 1;
}

.tank-gauge-text {
  font-size: 8px;
  fill: #606266;
  text-anchor: start;
}

.tank-label {
  font-size: 12px;
  fill: #303133;
  font-weight: bold;
  text-anchor: middle;
}

.tank-info {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: bold;
  color: #606266;
}

.info-value {
  color: #303133;
}
</style>