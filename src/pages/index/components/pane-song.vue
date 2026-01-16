<template>
  <view class="pane-song" v-if="list.length">
    <view class="count">{{ list.length }} 首歌曲</view>
    <view class="list w-full">
      <view v-for="(item, index) in list" :key="index" class="item w-full" :class="{ active: playIndex === index }">
        <view class="image shrink-0">
          <image :src="item.url" class="w-full h-full" mode="aspectFill" />
          <t-animation-play :open="isPlay" v-if="playIndex === index" />
        </view>
        <view class="info">
          <view class="truncate">{{ item.name }}</view>
          <view class="artist truncate">{{ item.artist }}</view>
        </view>
        <t-icon name="more" width="80rpx" height="100rpx" icon-size="30rpx" class="icon" />
      </view>
      <view class="placeholder">~~ 没有更多啦 ~~</view>
    </view>
  </view>
  <t-scan-file v-else />
</template>

<script lang="ts" setup>
const isPlay = computed(() => settingStore.state.isPlay)
const list = Array.from({ length: 4 }, (_, index) => ({
  id: index,
  name: `歌曲${index + 1}`,
  artist: `歌手${index + 1}`,
  url: `https://dummyimage.com/100x100/f60&text=歌曲${index + 1}`
}))
const playIndex = ref(0)
</script>

<style scoped lang="less">
.pane-song {
  padding: 30rpx;
  .count {
    position: sticky;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  .list {
    .item {
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
          color: #999;
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
    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 50rpx;
      color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
