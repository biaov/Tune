<template>
  <view class="play-rotate">
    <view class="content" :class="{ open }">
      <image :src="src" mode="aspectFill" class="rounded-full w-full h-full" />
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    open?: boolean
  }>(),
  {
    open: false
  }
)
</script>

<style scoped lang="less">
.play-rotate {
  margin: 30rpx 0 80rpx;
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .content {
    width: 580rpx;
    height: 580rpx;
    margin: 0 auto;
    background: linear-gradient(180deg, #e5e9ec, #dadde2);
    border: 1px solid rgba(0, 0, 0, 0.02);
    border-radius: 50%;
    padding: 16rpx;
    box-shadow: var(--box-shadow-2);
    animation: rotate 10s linear infinite;
    animation-play-state: paused;
    &.open {
      animation-play-state: running;
    }
  }
}
</style>
