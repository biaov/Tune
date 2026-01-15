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
  --text-color: #000;
  --theme-primary: #000;
  padding-top: var(--status-bar-height);
}
</style>
