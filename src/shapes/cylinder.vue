<template lang="html">
  <div class="cylinder-container" data-type="cylinder">
    <div class="cylinder">
      <div class="cylinder-top"></div>
      <div class="cylinder-body">
        <div 
          class="cylinder-liquid"
          :style="{ height: `${percentage}%` }"
        ></div>
      </div>
      <div class="capacity-label">{{ percentage }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const percentage = ref(30);
</script>

<style lang="css">
.cylinder-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.cylinder {
  position: relative;
  height: 100%;
  width: 100%;
  transform-style: preserve-3d;
}

.cylinder-top {
  position: absolute;
  width: 100%;
  height: 50px;
  top: 0;
  border-radius: 50% / 25%;
  background: linear-gradient(145deg, #888, #666);
  box-shadow: inset 0px 5px 10px rgba(0, 0, 0, 0.3);
  transform: rotateX(70deg);
  z-index: 3;
}

.cylinder-body {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #777, #999, #777);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    -10px 0 15px rgba(0, 0, 0, 0.2) inset,
    10px 0 15px rgba(255, 255, 255, 0.1) inset,
    0 5px 10px rgba(0, 0, 0, 0.4);
}

.cylinder-liquid {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, #3a6e85, #4a8eaa, #3a6e85);
  transition: height 0.8s ease-in-out;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2) inset;
}

.capacity-label {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2;
}
</style>