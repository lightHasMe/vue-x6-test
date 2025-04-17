<template lang="html">
  <div class="tank-container">
    <div class="tank-svg-wrapper">
      <svg class="tank-svg" viewBox="0 110 400 350" xmlns="http://www.w3.org/2000/svg">
        <!-- 定义渐变和纹理 -->
        <defs>
          <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#2c3e50; stop-opacity:1" />
            <stop offset="50%" style="stop-color:#5d6d7e; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2c3e50; stop-opacity:1" />
          </linearGradient>
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#5d6d7e; stop-opacity:1" />
            <stop offset="50%" style="stop-color:#7f8c8d; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5d6d7e; stop-opacity:1" />
          </linearGradient>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#154360; stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1a5276; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#154360; stop-opacity:1" />
          </linearGradient>
          <pattern id="metalPattern" patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill="#5d6d7e"/>
            <path d="M0 0L10 10M10 0L0 10" stroke="#4a5568" stroke-width="0.5" stroke-opacity="0.2"/>
          </pattern>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="5" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
          <filter id="bevel" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.5" specularExponent="20" lighting-color="#white" result="specular">
              <fePointLight x="50" y="50" z="100"/>
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular"/>
            <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>
          <!-- 新增强烈阴影效果 -->
          <filter id="strongShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
            <feOffset dx="10" dy="10" result="offsetBlur"/>
            <feFlood flood-color="rgba(0,0,0,0.7)" result="shadowColor"/>
            <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
            <feComposite in="SourceGraphic" in2="shadow" operator="over"/>
          </filter>
          <!-- 凹凸质感滤镜 -->
          <filter id="emboss" x="-10%" y="-10%" width="120%" height="120%">
            <feConvolveMatrix order="3" preserveAlpha="true" kernelMatrix="-2 -1 0 -1 1 1 0 1 2"/>
          </filter>
          <!-- 警示条纹 -->
          <pattern id="hazardPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
            <rect width="10" height="20" fill="#f39c12"/>
            <rect x="10" width="10" height="20" fill="#000000"/>
          </pattern>
        </defs>
        
        <!-- 混凝土基座 -->
        <rect x="80" y="440" width="240" height="60" fill="#95a5a6" rx="5" ry="5" filter="url(#shadow)" />
        <line x1="80" y1="450" x2="320" y2="450" stroke="#7f8c8d" stroke-width="1" />
        <line x1="80" y1="460" x2="320" y2="460" stroke="#7f8c8d" stroke-width="1" />
        <line x1="80" y1="470" x2="320" y2="470" stroke="#7f8c8d" stroke-width="1" />
        <line x1="80" y1="480" x2="320" y2="480" stroke="#7f8c8d" stroke-width="1" />
        
        <!-- 金属支架结构 -->
        <rect x="110" y="400" width="180" height="40" fill="#34495e" rx="2" ry="2" stroke="#2c3e50" stroke-width="3" filter="url(#shadow)" />
        <rect x="120" y="390" width="20" height="50" fill="#2c3e50" />
        <rect x="260" y="390" width="20" height="50" fill="#2c3e50" />
        <rect x="160" y="390" width="20" height="50" fill="#2c3e50" />
        <rect x="210" y="390" width="20" height="50" fill="#2c3e50" />
        
        <!-- 罐体底部法兰连接 -->
        <ellipse cx="200" cy="400" rx="80" ry="10" fill="#34495e" stroke="#2c3e50" stroke-width="2" filter="url(#shadow)" />
        
        <!-- 铆钉/螺栓装饰 - 底部 -->
        <circle cx="130" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="150" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="170" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="190" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="210" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="230" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="250" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="270" cy="400" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        
        <!-- 罐体底部 -->
        <ellipse cx="200" cy="400" rx="75" ry="15" fill="url(#tankGradient)" stroke="#2c3e50" stroke-width="3" filter="url(#shadow)" />
        
        <!-- 罐体主体 -->
        <path d="M 125 400 L 125 150 C 125 135 275 135 275 150 L 275 400" fill="url(#tankGradient)" stroke="#2c3e50" stroke-width="3" filter="url(#strongShadow)" />
        
        <!-- 罐体顶部 -->
        <ellipse cx="200" cy="150" rx="75" ry="15" fill="url(#tankGradient)" stroke="#2c3e50" stroke-width="3" filter="url(#shadow)" />
        
        <!-- 加强筋/缠绕带 - 更粗重 -->
        <path d="M 125 200 L 275 200" stroke="#2c3e50" stroke-width="6" />
        <path d="M 125 250 L 275 250" stroke="#2c3e50" stroke-width="6" />
        <path d="M 125 300 L 275 300" stroke="#2c3e50" stroke-width="6" />
        <path d="M 125 350 L 275 350" stroke="#2c3e50" stroke-width="6" />
        
        <!-- 加强筋铆钉 -->
        <circle cx="125" cy="200" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="275" cy="200" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="125" cy="250" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="275" cy="250" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="125" cy="300" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="275" cy="300" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="125" cy="350" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="275" cy="350" r="4" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        
        <!-- 纵向焊接线 -->
        <path d="M 200 150 L 200 400" stroke="#34495e" stroke-width="2" stroke-dasharray="4,2" />
        
        <!-- 液体 - 使用液位百分比动态计算 -->
        <g v-if="showLiquid">
          <path :d="liquidPath" fill="url(#liquidGradient)" opacity="0.9" />
          <ellipse :cx="200" :cy="liquidLevel" rx="74" ry="14" fill="url(#liquidGradient)" opacity="0.9" />
        </g>
        
        <!-- 顶部人孔/检修口 -->
        <ellipse cx="200" cy="120" rx="25" ry="10" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
        <ellipse cx="200" cy="120" rx="20" ry="8" fill="#2c3e50" />
        
        <!-- 人孔/检修口螺栓 -->
        <circle cx="185" cy="120" r="3" fill="#7f8c8d" />
        <circle cx="195" cy="120" r="3" fill="#7f8c8d" />
        <circle cx="205" cy="120" r="3" fill="#7f8c8d" />
        <circle cx="215" cy="120" r="3" fill="#7f8c8d" />
        
        <!-- 主管道系统 -->
        <!-- 进料管 -->
        <path d="M 100 220 L 125 220" stroke="url(#pipeGradient)" stroke-width="12" fill="none" />
        <circle cx="100" cy="220" r="8" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
        <rect x="100" y="215" width="10" height="10" fill="#7f8c8d" />
        
        <!-- 出料管 -->
        <path d="M 275 350 L 300 350 L 300 370 L 320 370" stroke="url(#pipeGradient)" stroke-width="12" fill="none" />
        <circle cx="300" cy="350" r="8" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
        <circle cx="300" cy="370" r="8" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
        
        <!-- 阀门1 -->
        <rect x="320" y="360" width="20" height="20" fill="#c0392b" stroke="#922b21" stroke-width="2" />
        <circle cx="330" cy="370" r="5" fill="#e74c3c" />
        <line x1="330" y1="365" x2="330" y2="375" stroke="#ecf0f1" stroke-width="2" />
        
        <!-- 顶部监测系统 -->
        <rect x="195" y="80" width="10" height="40" fill="#7f8c8d" stroke="#2c3e50" stroke-width="1" />
        <circle cx="200" cy="80" r="10" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
        <rect x="195" y="65" width="10" height="15" fill="#7f8c8d" />
        
        <!-- 压力表 -->
        <circle cx="150" cy="170" r="15" fill="#ecf0f1" stroke="#7f8c8d" stroke-width="2" />
        <circle cx="150" cy="170" r="12" fill="#f39c12" stroke="#7f8c8d" stroke-width="1" />
        <line x1="150" y1="170" x2="150" y2="160" stroke="#2c3e50" stroke-width="2" />
        <path d="M 140 170 L 160 170 M 150 180 L 150 160" stroke="#2c3e50" stroke-width="1" />
        <path d="M 125 170 L 135 170" stroke="url(#pipeGradient)" stroke-width="8" fill="none" />
        
        <!-- 工业液位计 - 左侧 -->
        <g v-if="showLevelIndicator" filter="url(#shadow)">
          <rect x="90" y="180" width="20" height="180" rx="2" ry="2" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
          <rect x="95" y="185" width="10" height="170" fill="#ecf0f1" stroke="#7f8c8d" stroke-width="1" />
          <rect x="95" :y="355 - (fillPercentage * 170 / 100)" width="10" :height="fillPercentage * 170 / 100" fill="#e67e22" />
          
          <!-- 液位计管道连接 -->
          <path d="M 110 200 L 125 200" stroke="url(#pipeGradient)" stroke-width="6" fill="none" />
          <path d="M 110 350 L 125 350" stroke="url(#pipeGradient)" stroke-width="6" fill="none" />
          
          <!-- 液位刻度线 -->
          <line x1="105" y1="185" x2="115" y2="185" stroke="#ecf0f1" stroke-width="1" />
          <text x="80" y="190" class="tank-gauge-text">100%</text>
          
          <line x1="105" y1="228" x2="115" y2="228" stroke="#ecf0f1" stroke-width="1" />
          <text x="80" y="233" class="tank-gauge-text">75%</text>
          
          <line x1="105" y1="270" x2="115" y2="270" stroke="#ecf0f1" stroke-width="1" />
          <text x="80" y="275" class="tank-gauge-text">50%</text>
          
          <line x1="105" y1="313" x2="115" y2="313" stroke="#ecf0f1" stroke-width="1" />
          <text x="80" y="318" class="tank-gauge-text">25%</text>
          
          <line x1="105" y1="355" x2="115" y2="355" stroke="#ecf0f1" stroke-width="1" />
          <text x="80" y="360" class="tank-gauge-text">0%</text>
        </g>
        
        <!-- 警示标记 -->
        <rect x="235" y="300" width="25" height="25" fill="url(#hazardPattern)" stroke="#000" stroke-width="1" />
        <path d="M 240 305 L 255 320 M 240 320 L 255 305" stroke="#000" stroke-width="2" />
        
        <!-- 走道/平台 -->
        <rect x="275" y="180" width="75" height="20" fill="#34495e" stroke="#2c3e50" stroke-width="2" filter="url(#shadow)" />
        <path d="M 276 180 L 276 167 L 350 167 L 350 180" stroke="#5d6d7e" stroke-width="3" fill="none" />
        <line x1="285" y1="167" x2="285" y2="180" stroke="#5d6d7e" stroke-width="1" />
        <line x1="300" y1="167" x2="300" y2="180" stroke="#5d6d7e" stroke-width="1" />
        <line x1="315" y1="167" x2="315" y2="180" stroke="#5d6d7e" stroke-width="1" />
        <line x1="330" y1="167" x2="330" y2="180" stroke="#5d6d7e" stroke-width="1" />
        <line x1="345" y1="167" x2="345" y2="180" stroke="#5d6d7e" stroke-width="1" />
        
        <!-- 二级阀门和管道 -->
        <path d="M 275 190 L 300 190" stroke="url(#pipeGradient)" stroke-width="8" fill="none" />
        <rect x="300" y="185" width="15" height="10" fill="#c0392b" stroke="#922b21" stroke-width="1" />
        <circle cx="307" cy="190" r="3" fill="#e74c3c" />
        
        <!-- 维护标签 -->
        <rect x="240" y="200" width="25" height="15" fill="#f1c40f" stroke="#f39c12" stroke-width="1" />
        <line x1="245" y1="205" x2="260" y2="205" stroke="#000" stroke-width="1" />
        <line x1="245" y1="210" x2="260" y2="210" stroke="#000" stroke-width="1" />
        
        <!-- 电气控制箱 -->
        <rect x="320" y="270" width="30" height="45" fill="#7f8c8d" stroke="#2c3e50" stroke-width="2" rx="2" ry="2" filter="url(#shadow)" />
        <rect x="325" y="275" width="20" height="15" fill="#34495e" />
        <circle cx="330" cy="305" r="3" fill="#e74c3c" />
        <circle cx="340" cy="305" r="3" fill="#2ecc71" />
        
        <!-- 金属反光/高光效果 -->
        <ellipse cx="150" cy="250" rx="20" ry="80" fill="white" opacity="0.1" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'

// 液位百分比（0-100）
const fillPercentage = ref(35)
// 是否显示液体
const showLiquid = ref(true)
// 是否显示液位计
const showLevelIndicator = ref(true)

// 计算液位高度
const liquidLevel = computed(() => {
  return 400 - (fillPercentage.value * 250 / 100)
})

// 计算液体路径
const liquidPath = computed(() => {
  const level = liquidLevel.value
  return `M 125 400 L 125 ${level} C 125 ${level - 15} 275 ${level - 15} 275 ${level} L 275 400`
})
</script>

<style lang="css" scoped>
.tank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 600px;
}

.tank-gauge-text {
  font-size: 10px;
  fill: #f39c12;
  text-anchor: end;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

@keyframes liquidWave {
  0% { transform: translateX(0); }
  50% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}
</style>