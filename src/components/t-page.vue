<template>
  <view :class="name" :style="getStyle">
    <slot></slot>
  </view>
</template>
<script lang="ts" setup>
const name = 't-page'
const { statusBarHeight } = uni.getSystemInfoSync()
const getStyle = useCssVars({
  statusBarHeight: `${statusBarHeight}px`,
  iosBottomHeight: '0px'
})
</script>
<style scoped lang="less">
.t-page {
  padding-top: var(--status-bar-height);
  --text-color: #000;
  --theme-primary: #000;
  --color-primary-2: #1677ff;
  --theme-primary-hover: #333;
  --bg-default: #f1f5ff;
  --bg-active: rgba(0, 0, 0, 0.02);
  --color-text-2: #949494;
}
</style>
