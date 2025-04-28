<template lang="html">
  <div class="switch-container" data-type="switch">
    <div class="svg-wrapper">
      <svg 
        v-if="isOn" 
        class="switch-svg"
        viewBox="0 0 298 298"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="m298,178.248h-59.517c-3.323-9.592-12.442-16.5-23.151-16.5-13.51,0-24.5,10.99-24.5,24.5 0,13.51 10.99,24.5 24.5,24.5 10.709,0 19.828-6.908 23.151-16.5h59.517v-16zm-74.168,8c0,4.687-3.814,8.5-8.5,8.5-4.687,0-8.5-3.813-8.5-8.5 0-4.686 3.813-8.5 8.5-8.5 4.686,0 8.5,3.813 8.5,8.5z"
          ></path>
          <path
            d="m171.014,87.252l-76.967,76.967c-3.238-1.582-6.873-2.472-10.713-2.472-10.709,0-19.828,6.908-23.151,16.5h-60.183v16h60.183c3.323,9.592 12.442,16.5 23.151,16.5 13.51,0 24.5-10.99 24.5-24.5 0-3.841-0.891-7.476-2.472-10.715l76.966-76.966-11.314-11.314zm-96.18,98.996c0-4.686 3.813-8.5 8.5-8.5s8.5,3.814 8.5,8.5c0,4.687-3.813,8.5-8.5,8.5s-8.5-3.814-8.5-8.5z"
          ></path>
        </g>
      </svg>
      <svg 
        v-else 
        class="switch-svg"
        viewBox="0 0 298 298"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="m298,178.248h-59.517c-3.323-9.592-12.442-16.5-23.151-16.5s-19.828,6.908-23.151,16.5h-85.695c-3.323-9.592-12.442-16.5-23.151-16.5s-19.828,6.908-23.151,16.5h-60.184v16h60.183c3.323,9.592 12.442,16.5 23.151,16.5s19.828-6.908 23.151-16.5h85.695c3.323,9.592 12.442,16.5 23.151,16.5s19.828-6.908 23.151-16.5h59.518v-16zm-74.168,8c0,4.686-3.814,8.5-8.5,8.5-4.687,0-8.5-3.814-8.5-8.5s3.813-8.5 8.5-8.5c4.686,0 8.5,3.814 8.5,8.5zm-131.998,0c0,4.686-3.814,8.5-8.5,8.5-4.687,0-8.5-3.814-8.5-8.5s3.813-8.5 8.5-8.5c4.686,0 8.5,3.814 8.5,8.5z"
          ></path>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOn = ref(false);

</script>

<style lang="css" scoped>
.switch-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.svg-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switch-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  fill: #777;
  transition: opacity 0.2s ease;
}

.switch-label {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
  font-weight: bold;
}
</style>