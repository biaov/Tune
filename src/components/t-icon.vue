<template>
  <view class="t-icon" :style="getStyle" @click="onClick">
    <image :src="`/static/${name}${ext}`" class="image" :mode="mode" />
  </view>
</template>
<script lang="ts" setup>
import type { ImageMode } from '@uni-helper/uni-app-types'

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()
const props = withDefaults(
  defineProps<{
    width: string
    height?: string
    iconSize: string
    name: string
    mode?: ImageMode
    ext?: string
  }>(),
  {
    height: '100%',
    mode: 'widthFix',
    ext: '.svg'
  }
)
const getStyle = computed(() => ({
  '--width': props.width,
  '--height': props.height,
  '--image-size': props.iconSize
}))
const onClick = (e: Event) => {
  emit('click', e)
}
</script>
<style scoped lang="less">
.t-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--width);
  height: var(--height);
  flex-shrink: 0;
  border-radius: 10rpx;
  &:active {
    background: var(--bg-active);
  }
  .image {
    width: var(--image-size);
    height: var(--image-size);
  }
}
</style>
