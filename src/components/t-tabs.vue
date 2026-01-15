<template>
  <view class="t-tabs" :style="tabStyle">
    <div class="t-tabs__wrap">
      <slot></slot>
    </div>
  </view>
</template>

<script lang="ts" setup>
const slots = defineSlots<{
  default: () => [{ children: unknown[] }]
}>()
const { length } = slots.default()[0].children
const count = 100 / length
const activeIndex = defineModel<number>({ default: 0 })
const tabStyle = computed(() => ({
  '--total-width': `${length * 100}%`,
  '--tab-width': `${count.toFixed(4)}%`,
  '--x': `translateX(-${(activeIndex.value * count).toFixed(4)}%)`
}))
</script>

<style scoped lang="less">
.t-tabs {
  width: 100%;

  &__wrap {
    width: var(--total-width);
    display: inline-flex;
    transition: transform 0.3s ease-in-out;
    transform: var(--x);
  }
}
</style>
