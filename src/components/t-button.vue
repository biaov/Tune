<template>
  <view class="t-button" :class="`t-button--${props.type}`" :style="getStyle" @click="onClick">
    <slot></slot>
  </view>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'click'): void
}>()
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    type?: 'primary' | 'default' | 'info'
    radius?: string
  }>(),
  {
    type: 'default',
    width: '100%',
    height: '80rpx',
    radius: '10rpx'
  }
)
const getStyle = computed(() => ({
  '--width': props.width,
  '--height': props.height,
  '--radius': props.radius
}))
const onClick = () => {
  emit('click')
}
</script>
<style scoped lang="less">
.t-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--width);
  height: var(--height);
  border: 1px solid;
  border-radius: var(--radius);
  font-size: 26rpx;

  &--default {
    border-color: #000;
    color: #000;
    &:active {
      background: rgba(0, 0, 0, 0.02);
    }
  }
  &--primary {
    background: var(--theme-primary);
    border-color: var(--theme-primary);
    color: #fff;
    &:active {
      background: var(--theme-primary-hover);
    }
  }
  &--info {
    border-color: rgba(0, 0, 0, 0.1);
    color: #999;
    &:active {
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
