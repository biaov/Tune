<template>
  <view class="t-animation-play" :class="{ open }">
    <view class="content">
      <view class="line" v-for="_ in 3"></view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    open?: boolean
  }>(),
  {
    open: false
  }
)
</script>
<style scoped lang="less">
@keyframes flexible1 {
  0% {
    height: 100%;
  }
  50% {
    height: 30%;
  }
  100% {
    height: 100%;
  }
}
@keyframes flexible2 {
  0% {
    height: 30%;
  }
  50% {
    height: 90%;
  }
  100% {
    height: 30%;
  }
}
.t-animation-play {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  @width: 5rpx;

  .content {
    display: flex;
    align-items: center;
    height: 40rpx;
    gap: 8rpx;
    .line {
      width: @width;
      animation: 1s linear infinite;
      animation-play-state: paused;
      background: #fff;
      border-radius: @width;

      @list: flexible1, flexible2, flexible1;
      each(@list, {
        &:nth-child(@{index}) {
          animation-name: @value;
        }
      });
    }
  }
  &.open {
    .line {
      animation-play-state: running;
    }
  }
}
</style>
