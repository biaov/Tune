<template>
  <view class="search">
    <input type="text" v-model="keyword" placeholder="请输入歌曲名称" class="search__input" />
    <scroll-view scroll-y class="scroll-view" v-if="list.length">
      <view class="count">共 {{ list.length }} 首歌曲</view>
      <view class="list w-full">
        <t-song-item v-for="(item, index) in list" :key="index" :item="item" @click="onClickItem(item)" />
        <view class="placeholder">~~ 没有更多啦 ~~</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const keyword = ref('')
const list = computed(() => (keyword.value ? songStore.state.songs.filter(item => item.name.includes(keyword.value)) : []))

const onClickItem = (item: SongItemType) => {
  songStore.onUpdatePlayId(item.id, false)
  uni.navigateTo({ url: '/pages/detail/index' })
}
</script>

<style lang="less" scoped>
.search {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  &__input {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 10rpx;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    font-size: 24rpx;
  }
  .scroll-view {
    flex-grow: 1;
    height: 50%;
    width: 100%;
    .count {
      position: sticky;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
    .list {
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 50rpx;
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
