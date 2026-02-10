<template>
  <view class="pane-song" v-if="list.length">
    <view class="count">{{ list.length }} 首歌曲</view>
    <view class="w-full">
      <t-song-item v-for="(item, index) in list" :key="index" :item="item" :active="songStore.state.playId === item.id" more @click="onClickPlay(item)" @click-mor="onMoreClick(item)" />
      <t-no-more />
    </view>
  </view>
  <t-scan-file v-else />
  <t-dropdown v-model:visible="detailVisible">
    <view class="modal-title">详情</view>
    <view class="modal-list">
      <view class="item" v-for="(item, index) in modalList" :key="index" @click="onModalItem(item)">
        <t-icon :name="item.icon" width="40rpx" height="40rpx" icon-size="30rpx" />
        {{ item.label }}
      </view>
    </view>
    <template #footer>
      <view class="model-footer">
        <t-button type="info" @click="setDetailVisible(false)">关闭</t-button>
      </view>
    </template>
  </t-dropdown>
</template>

<script lang="ts" setup>
import { songStore } from '@/store/song'
import { ModalButtonType } from '../enums'

const list = computed(() => {
  const songs = JSON.parse(JSON.stringify([...songStore.state.songs])) as SongItemType[]
  songs.sort((a, b) => {
    switch (songStore.state.sortType) {
      case SortEnum.nameAsc:
        return a.name.localeCompare(b.name, 'zh-CN')
      case SortEnum.nameDesc:
        return b.name.localeCompare(a.name, 'zh-CN')
      case SortEnum.artistAsc:
        return a.artist.localeCompare(b.artist, 'zh-CN')
      case SortEnum.artistDesc:
        return b.artist.localeCompare(a.artist, 'zh-CN')
      case SortEnum.createAsc:
        return dayjs(a.createdTime) - dayjs(b.createdTime)
      case SortEnum.createDesc:
        return dayjs(b.createdTime) - dayjs(a.createdTime)
    }
  })
  return songs
})
const moreItem = ref<SongItemType | null>(null)
const onClickPlay = (item: SongItemType) => {
  songStore.onUpdatePlayId(item.id)
}
const onMoreClick = (item: SongItemType) => {
  moreItem.value = item
  setDetailVisible(true)
}
const [detailVisible, setDetailVisible] = useState(false)

const modalList = [
  {
    label: '播放',
    value: ModalButtonType.play,
    icon: 'play'
  },
  {
    label: '删除',
    value: ModalButtonType.delete,
    icon: 'delete'
  }
]
const onModalItem = (item: (typeof modalList)[0]) => {
  switch (item.value) {
    case ModalButtonType.play:
      onClickPlay(moreItem.value!)
      break
    case ModalButtonType.delete:
      songStore.removeSong(moreItem.value!.id)
      break
  }
  setDetailVisible(false)
}
</script>

<style scoped lang="less">
.pane-song {
  padding: 30rpx;
  .count {
    position: sticky;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
}
.modal-title {
  font-size: 30rpx;
  font-weight: bold;
  text-align: center;
  padding-top: 30rpx;
}
.modal-list {
  display: flex;
  flex-wrap: wrap;
  padding: 30rpx;
  .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    height: 128rpx;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-top-width: 0;
    border-left-width: 0;
    padding: 20rpx 0;
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      border-top-width: 1px;
    }
    &:nth-child(4n + 1) {
      border-left-width: 1px;
    }
    &:active {
      background: var(--bg-active);
    }
  }
}
.model-footer {
  padding: 30rpx;
}
</style>
