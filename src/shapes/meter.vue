<template lang="html">
  <div class="meter-container">
    <div class="meter">
      <svg 
        class="meter-svg" 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- 表盘外框 -->
        <circle 
          cx="100" 
          cy="100" 
          r="90" 
          class="meter-case"
        />
        
        <!-- 表盘内圈 -->
        <circle 
          cx="100" 
          cy="100" 
          r="85" 
          class="meter-face"
        />
        
        <!-- 刻度线 -->
        <g class="meter-marks">
          <!-- 生成20个刻度线 -->
          <template v-for="n in 20" :key="n">
            <line
              :x1="100 + 65 * Math.cos((n * 13.5 - 90) * Math.PI / 180)"
              :y1="100 + 65 * Math.sin((n * 13.5 - 90) * Math.PI / 180)"
              :x2="100 + 75 * Math.cos((n * 13.5 - 90) * Math.PI / 180)"
              :y2="100 + 75 * Math.sin((n * 13.5 - 90) * Math.PI / 180)"
              class="mark"
              :class="{ 'mark-major': n % 4 === 0 }"
            />
            
            <!-- 主刻度的数字 -->
            <text
              v-if="n % 4 === 0"
              :x="100 + 58 * Math.cos((n * 13.5 - 90) * Math.PI / 180)"
              :y="100 + 58 * Math.sin((n * 13.5 - 90) * Math.PI / 180)"
              text-anchor="middle"
              dominant-baseline="middle"
              class="mark-text"
            >{{ formatValue(maxValue * n / 20) }}</text>
          </template>
        </g>
        
        <!-- 指针 -->
        <g class="pointer-group">
          <!-- 路径向上（-90度）时指向0位置 -->
          <path
            d="M100,35 L103,100 L100,105 L97,100 Z"
            class="pointer"
            :style="{ transform: `rotate(${pointerAngle}deg)`, 'transform-origin': '100px 100px' }"
          />
        </g>
        
        <!-- 中心圆装饰 -->
        <circle
          cx="100"
          cy="100"
          r="12"
          class="meter-center"
        />
        
        <!-- 单位标签 -->
        <text
          x="70"
          y="60"
          text-anchor="middle"
          class="unit-text"
        >{{ unit }}</text>
        
        <!-- 当前值显示 -->
        <text
          x="70"
          y="73"
          text-anchor="middle"
          class="value-text"
        >{{ formatValue(currentValue) }}/{{ formatValue(maxValue) }}</text>
      </svg>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const currentValue = ref(0.2);
const maxValue = ref(1.0);
const unit = ref('MPa');

// 目标指针角度
const targetAngle = computed(() => {
  const percentage = currentValue.value / maxValue.value;
  // 限制在0-1范围内
  const clampedPercentage = Math.min(Math.max(percentage, 0), 1);
  // 将百分比转换为0-270度的角度，从-90度开始旋转
  return 0 + (clampedPercentage * 270);
});

// 当前指针角度（用于动画）
const pointerAngle = ref(targetAngle.value);

// 监听目标角度变化，平滑过渡到新角度
watch(targetAngle, (newAngle) => {
  // 使用RAF实现平滑动画
  animatePointer(pointerAngle.value, newAngle);
});

// 平滑动画函数
function animatePointer(startAngle: number, endAngle: number): void {
  const startTime = performance.now();
  const duration = 800; // 动画持续时间（毫秒）
  
  function updatePointer(timestamp: number): void {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数让动画更自然
    const easeProgress = easeOutElastic(progress);
    
    // 计算当前角度
    pointerAngle.value = startAngle + (endAngle - startAngle) * easeProgress;
    
    // 如果动画未完成，继续请求下一帧
    if (progress < 1) {
      requestAnimationFrame(updatePointer);
    }
  }
  
  requestAnimationFrame(updatePointer);
}

// 弹性缓动函数
function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;
  
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

// 增加当前值的函数
function incrementValue(): void {
  // 增加当前值，但不超过最大值
  currentValue.value = Math.min(currentValue.value + 0.1, maxValue.value);
  // 四舍五入到一位小数，避免浮点数精度问题
  currentValue.value = Math.round(currentValue.value * 10) / 10;
}

// 格式化数值，处理小数
const formatValue = (value: number) => {
  // 如果是整数或大于10的数，不显示小数
  if (Number.isInteger(value) || value >= 10) {
    return Math.round(value);
  }
  
  // 如果是小数，根据大小显示不同精度
  if (value < 0.1) {
    return value.toFixed(2);
  }
  
  return value.toFixed(1);
};
</script>

<style lang="css" scoped>
.meter-container {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 20px auto;
  perspective: 800px;
}

.meter {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.meter-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.4));
}

.meter-case {
  fill: #333;
  stroke: #222;
  stroke-width: 2;
}

.meter-face {
  fill: #1a1a1a;
  stroke: none;
}

.mark {
  stroke: #999;
  stroke-width: 1;
}

.mark-major {
  stroke: #fff;
  stroke-width: 1.5;
}

.mark-text {
  fill: #6ad0ff;
  font-size: 10px;
  font-family: Arial, sans-serif;
}

.pointer {
  fill: #dd0000;
  stroke: #aa0000;
  stroke-width: 1;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}

.meter-center {
  fill: #555;
  stroke: #444;
  stroke-width: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.unit-text {
  fill: #6ad0ff;
  font-size: 14px;
  font-weight: bold;
}

.value-text {
  fill: #6ad0ff;
  font-size: 12px;
}
</style>