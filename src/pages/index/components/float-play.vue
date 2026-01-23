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
      <t-icon :name="songStore.state.isPlay ? 'pause' : 'play'" width="80rpx" height="80rpx" icon-size="30rpx" class="icon" @click.stop="songStore.onTogglePlay()" />
      <t-icon name="next" width="80rpx" height="80rpx" icon-size="30rpx" class="icon" @click.stop="songStore.onPlayPrevNext(1)" />
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
  height: 120rpx;
  background: #fff;
  padding: 0 30rpx;
  box-shadow: var(--box-shadow);
  .item {
    display: flex;
    height: 100%;
    align-items: center;
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
