<template>
  <t-page>
    <view class="deail">
      <play-rotate :src="songStore.playItem.value!.url" :open="songStore.state.isPlay" />
      <scroll-view scroll-y class="scroll-view"></scroll-view>
      <play-progress :current="songStore.currentSecond.value" :total="songStore.duration.value" :progress="songStore.state.progress" @update:model-value="songStore.onUpdateProgress" />
      <play-button :play="songStore.state.isPlay" @click="onClickButton" />
      <view class="flex justify-between w-full">
        <t-icon :name="playTypeIcon" width="100rpx" height="100rpx" icon-size="34rpx" @click="onClickPlayType" />
        <t-icon name="sort" width="100rpx" height="100rpx" icon-size="34rpx" @click="onClickMore" />
      </view>
    </view>
    <t-dropdown v-model:visible="visibleModal">
      <template #footer></template>
      <view class="modal-title">当前播放</view>
      <scroll-view scroll-y class="modal-scroll-view">
        <view class="content">
          <t-song-item v-for="(item, index) in songStore.state.songs" :key="index" :item="item" :active="item.id === songStore.state.playId" @click="songStore.onUpdatePlayId(item.id)">
            <t-icon name="delete" width="80rpx" height="80rpx" icon-size="30rpx" @click.stop="onRemove(item.id)" />
          </t-song-item>
          <t-no-more />
        </view>
      </scroll-view>
    </t-dropdown>
  </t-page>
</template>

<script setup lang="ts">
import PlayRotate from './components/play-rotate.vue'
import PlayProgress from './components/play-progress.vue'
import PlayButton from './components/play-button.vue'
import { songStore } from '@/store/song'

const playTypeIcon = computed(() => {
  switch (songStore.state.playType) {
    case PlayTypeEnum.sequence:
      return 'sequence'
    case PlayTypeEnum.loop:
      return 'loop'
    case PlayTypeEnum.random:
      return 'random'
  }
})

const onClickButton = (value: PlayButtonEnum) => {
  switch (value) {
    case PlayButtonEnum.prev:
      songStore.onPlayPrevNext(-1)
      break
    case PlayButtonEnum.next:
      songStore.onPlayPrevNext(1)
      break
    case PlayButtonEnum.play:
      songStore.onTogglePlay()
      break
  }
}
const playTypeOptions = [
  {
    value: PlayTypeEnum.sequence,
    label: '顺序播放'
  },
  {
    value: PlayTypeEnum.loop,
    label: '单曲循环'
  },
  {
    value: PlayTypeEnum.random,
    label: '随机播放'
  }
]

const onClickPlayType = () => {
  let index = playTypeOptions.findIndex(item => item.value === songStore.state.playType) + 1
  index >= playTypeOptions.length && (index = 0)
  const item = playTypeOptions[index]!
  songStore.onUpdatePlayType(item.value)
  useToast(item.label)
}
const [visibleModal, setVisibleModal] = useState(false)
const onClickMore = () => {
  if (!songStore.state.songs.length) {
    useToast('暂无歌曲')
    return
  }
  setVisibleModal(true)
}
const onRemove = (id: string) => {
  songStore.removeSong(id)
  id === songStore.state.playId && songStore.onPlayPrevNext(1)
}
</script>

<style lang="less" scoped>
.deail {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: var(--ios-bottom-height);
  .scroll-view {
    flex-grow: 1;
    height: 0;
  }
}
.modal-title {
  padding: 32rpx 0;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  color: var(--color-text-1);
}
.modal-scroll-view {
  height: 60vh;
  .content {
    padding: 0 30rpx 30rpx;
  }
}
</style>
