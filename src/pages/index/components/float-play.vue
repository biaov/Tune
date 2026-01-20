<template>
  <view class="float-play">
    <view class="item" @click="onDetail">
      <view class="image shrink-0">
        <image :src="item.url" class="w-full h-full" mode="aspectFill" />
      </view>
      <view class="info">
        <view class="truncate" v-if="item.name">{{ item.name }}</view>
        <view class="artist truncate" v-if="item.artist">{{ item.artist }}</view>
      </view>
      <t-icon :name="songStore.state.isPlay ? 'pause' : 'play_fill'" width="80rpx" height="80rpx" icon-size="30rpx" class="icon" @click.stop="songStore.onUpdatePlay" />
      <t-icon name="next" width="80rpx" height="80rpx" icon-size="30rpx" class="icon" @click.stop="songStore.onNextSong" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { songStore } from '@/store/song'

const item = computed(
  () =>
    songStore.playItem.value || {
      name: '',
      artist: '',
      url: '/static/logo.svg'
    }
)

const onDetail = () => {
  if (!item.value.name) {
    useToast('请先选择歌曲')
    return
  }
  uni.navigateTo({ url: '/pages/detail/index' })
}
</script>
<style scoped lang="less">
.float-play {
  position: fixed;
  bottom: var(--ios-bottom-height);
  left: 0;
  width: 100%;
  background: #fff;
  padding: 20rpx 30rpx;
  .item {
    display: flex;
    .image {
      @size: 80rpx;
      position: relative;
      width: @size;
      height: @size;
      border-radius: 10rpx;
      overflow: hidden;
      margin-right: 20rpx;
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
  }
}
</style>
