<template>
  <scroll-view scroll-y :class="name" :style="getStyle">
    <view class="scroll-content">
      <slot></slot>
    </view>
  </scroll-view>
</template>
<script lang="ts" setup>
const name = 't-page'
const { statusBarHeight } = uni.getSystemInfoSync()
const getStyle = useCssVars({
  statusBarHeight: `${statusBarHeight}px`,
  iosBottomHeight: '0px'
})
</script>
<style lang="less" scoped>
.t-page {
  --text-color: #000;
  --theme-primary: #000;
  --color-primary-2: #1677ff;
  --theme-primary-hover: #333;
  // --bg-default: #f1f5ff;
  --bg-default: #fff;
  --bg-active: rgba(0, 0, 0, 0.02);
  --color-text-2: #949494;
  --box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  --box-shadow-2: 0 0 20rpx rgba(0, 0, 0, 0.1);
  background: var(--bg-default);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .scroll-content {
    padding-top: var(--status-bar-height);
  }
}
</style>
