<template>
  <view class="t-song-item w-full" :class="{ active }" @click="emit('click')">
    <view class="image shrink-0">
      <image :src="item.url" class="w-full h-full" mode="aspectFill" />
      <t-animation-play :open="songStore.state.isPlay" v-if="active" />
    </view>
    <view class="info">
      <view class="truncate">{{ item.name }}</view>
      <view class="artist truncate">{{ item.artist }}</view>
    </view>
    <t-icon name="more" width="80rpx" height="100rpx" icon-size="30rpx" class="icon" @click.stop="emit('click-more')" v-if="more" />
  </view>
</template>
<script lang="ts" setup>
import { songStore } from '@/store/song'

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'click-more'): void
}>()
const props = withDefaults(
  defineProps<{
    item: SongItemType
    active?: boolean
    more?: boolean
  }>(),
  {
    active: false,
    more: false
  }
)
</script>
<style scoped lang="less">
.t-song-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
  .image {
    @size: 100rpx;
    position: relative;
    width: @size;
    height: @size;
    border-radius: 10rpx;
    overflow: hidden;
  }
  .info {
    width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .artist {
      margin-top: 10rpx;
      color: var(--color-text-2);
    }
  }
  .icon {
    transform: rotate(90deg);
  }
  &.active {
    .info {
      color: var(--color-primary-2);
      .artist {
        color: var(--color-primary-2);
      }
    }
  }
}
</style>
