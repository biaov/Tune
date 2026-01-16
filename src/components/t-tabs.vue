<template>
  <view class="t-tabs" :style="tabStyle">
    <view class="t-tabs__wrap" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
const slots = defineSlots<{
  default: () => [{ children: unknown[] }]
}>()
const { length } = slots.default()[0].children
const lengthMaxIndex = length - 1
const count = 100 / length
const activeIndex = defineModel<number>({ default: 0 })

let startX = 0 // 触摸开始时的 X 坐标
const moveX = ref(0) // 移动距离
const limit = 50 // 滑动阈值
const touchValid = (x: number) => {
  // 第一个不能向左滑动
  if (x > 0 && !activeIndex.value) return false
  // 最后一个不能向右滑动
  if (x < 0 && activeIndex.value === lengthMaxIndex) return false
  return true
}
const onTouchStart = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  startX = e.changedTouches[0]!.clientX
  moveX.value = 0
}

const onTouchMove = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  if (!startX) return
  const x = e.changedTouches[0]!.clientX - startX
  if (!touchValid(x)) return
  moveX.value = x
}
const onTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches.length) return
  if (!startX) return
  if (!touchValid(e.changedTouches[0]!.clientX - startX)) return
  // 移动距离超过阈值，切换到下一个或上一个标签
  if (moveX.value >= limit) {
    activeIndex.value = (activeIndex.value - 1 + length) % length
  } else if (moveX.value <= -limit) {
    activeIndex.value = (activeIndex.value + 1) % length
  }

  moveX.value = 0
}

const tabStyle = computed(() => ({
  '--total-width': `${length * 100}%`,
  '--tab-width': `${count.toFixed(4)}%`,
  '--x': `translateX(calc(-${(activeIndex.value * count).toFixed(4)}% + ${moveX.value}px))`,
  '--transition-name': moveX.value ? 'none' : 'transform'
}))
</script>

<style scoped lang="less">
.t-tabs {
  width: 100%;
  overflow: hidden;
  min-height: 80vh;

  &__wrap {
    width: var(--total-width);
    display: inline-flex;
    transition: var(--transition-name) 0.3s ease;
    transform: var(--x);
  }
}
</style>
