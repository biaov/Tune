<template>
  <view :class="name" :style="`--status-bar-height: ${statusBarHeight}px`">
    <slot></slot>
  </view>
</template>
<script lang="ts" setup>
const name = 't-page'
const { statusBarHeight } = uni.getSystemInfoSync()
</script>
<style scoped lang="less">
.t-page {
  padding-top: var(--status-bar-height);
  --text-color: #000;
  --theme-primary: #000;
  --color-primary-2: #1677ff;
  --theme-primary-hover: #333;
  --bg-default: #f1f5ff;
}
</style>
