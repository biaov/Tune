<template>
  <view class="play-button">
    <view class="item rounded-full" v-for="(item, index) in buttons" :key="index" @click="onClickButton(item.value)">
      <t-icon :name="item.icon" :width="item.size" :height="item.size" :icon-size="item.iconSize" :rotate="item.rotate" />
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', value: PlayButtonEnum): void
}>()
const props = withDefaults(
  defineProps<{
    play?: boolean
  }>(),
  {
    play: false
  }
)

const buttons = computed(() => [
  {
    size: '120rpx',
    iconSize: '30rpx',
    icon: 'next',
    rotate: 180,
    value: PlayButtonEnum.prev
  },
  {
    size: '120rpx',
    iconSize: '30rpx',
    icon: props.play ? 'pause' : 'play',
    value: PlayButtonEnum.play
  },
  {
    size: '120rpx',
    iconSize: '30rpx',
    icon: 'next',
    value: PlayButtonEnum.next
  }
])
const onClickButton = (value: PlayButtonEnum) => {
  emit('click', value)
}
</script>

<style scoped lang="less">
.play-button {
  margin: 30rpx 0;
  padding: 0 97rpx;
  display: flex;
  justify-content: space-around;
  gap: 98rpx;
  .item {
    overflow: hidden;
    box-shadow: var(--box-shadow-2);
  }
}
</style>
