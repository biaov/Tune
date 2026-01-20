<template>
  <t-page>
    <view class="header">
      <view class="header-menu">
        <view class="title">Tune</view>
        <view class="menu-more">
          <view v-for="(item, index) in menu" :key="index" @click="onClickItem(item)" class="item">
            <image :src="item.icon" class="img" mode="widthFix" />
          </view>
        </view>
      </view>
    </view>
    <view class="container">
      <pane-song />
    </view>
    <t-dropdown v-model:visible="sortVisible" @ok="onSortSubmit">
      <view class="dropdown-sort">
        <view class="title">排序方式</view>
        <radio-group @change="onSortChange">
          <label class="item" :class="{ active: currentSortValue === item.value }" v-for="(item, index) in sortList" :key="index">
            <radio
              :value="item.value"
              :checked="currentSortValue === item.value"
              class="radio"
              active-border-color="var(--theme-primary)"
              active-background-color="var(--theme-primary)"
              border-color="#999"
            />
            {{ item.label }}
          </label>
        </radio-group>
      </view>
    </t-dropdown>
    <float-play />
  </t-page>
</template>

<script setup lang="ts">
import PaneSong from './components/pane-song.vue'
import FloatPlay from './components/float-play.vue'
import { useMenu, useSortModal } from './hooks'

const { currentSortValue, sortList, onSortChange } = useSortModal()
const { menu, onClickItem, sortVisible, setSortVisible } = useMenu({ currentSortValue })

const onSortSubmit = () => {
  songStore.onUpdateSortType(currentSortValue.value)
  setSortVisible(false)
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
