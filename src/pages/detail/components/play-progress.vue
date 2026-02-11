<template>
  <view class="play-progress" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view class="content">
      <view class="tips" v-if="isShowTips">{{ currentProgressTips }}</view>
      <view class="progress">
        <view class="progress__bar" :style="{ transform: `translateX(${progress - 100}%)` }"></view>
      </view>
      <view class="indicator" :style="{ left: `${progress}%` }"></view>
    </view>
    <view class="text">
      <text>{{ currentTime }}</text>
      <text>{{ totalTime }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number
    total: number
  }>(),
  {}
)

const progressModel = defineModel<number>({ default: 0 })
const progress = ref(0)
const currentTime = computed(() => useSecondToTime(props.current))
const totalTime = computed(() => useSecondToTime(props.total))
const currentProgressTips = computed(() => useSecondToTime(Math.round((progress.value * props.total) / 100)))
watch(
  progressModel,
  value => {
    progress.value = value
  },
  { immediate: true }
)
const rpxRange = 700 - 50 // 范围值
const systemInfo = uni.getSystemInfoSync()
const ratio = 750 / systemInfo.windowWidth
const calcProgress = (x: number) => {
  let curProgress = ((x * ratio - 50) / rpxRange) * 100
  curProgress < 0 && (curProgress = 0)
  curProgress > 100 && (curProgress = 100)
  return +curProgress.toFixed(2)
}
const isShowTips = ref(false)

const onTouchStart = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  onTouchMove(e)
  songStore.onTogglePlay(false)
}
const onTouchMove = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  progress.value = calcProgress(e.changedTouches[0]!.clientX)
  isShowTips.value = true
}
const onTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  progress.value = calcProgress(e.changedTouches[0]!.clientX)
  progressModel.value = progress.value
  isShowTips.value = false
  songStore.onTogglePlay(true)
}
</script>

<style scoped lang="less">
.play-progress {
  padding: 50rpx;
  .content {
    @size: 10rpx;
    position: relative;
    width: 100%;
    height: @size;
    margin-bottom: 20rpx;
    .tips {
      position: absolute;
      top: -100rpx;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 110rpx;
      @height: 60rpx;
      height: @height;
      border-radius: @height;
      background: rgba(0, 0, 0, 0.8);
      box-shadow: var(--box-shadow);
    }
    .progress {
      width: 100%;
      height: 100%;
      border-radius: @size;
      overflow: hidden;
      background: #d9e8ef;
      &__bar {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #75f8d2, #6096db, #2ae3fc);
        border-radius: @size;
        transform: translateX(-100%);
      }
    }
    .indicator {
      width: 30rpx;
      height: 30rpx;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 50%;
      box-shadow: var(--box-shadow);
    }
  }
  .text {
    display: flex;
    justify-content: space-between;
    color: var(--color-text-2);
  }
}
</style>
