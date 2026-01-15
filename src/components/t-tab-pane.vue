<template>
  <view class="t-tab-pane">
    <slot></slot>
  </view>
</template>

<style scoped lang="less">
.t-tab-pane {
  flex: 1 0 auto;
  width: var(--tab-width);
}
</style>
