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
      <view class="header-tabs">
        <view class="item" :class="{ active: formState.activeTabIndex === index }" v-for="(item, index) in tabs" :key="index" @click="onClickTab(index)">
          {{ item.label }}
        </view>
      </view>
    </view>
    <view class="container">
      <t-tabs v-model="formState.activeTabIndex">
        <t-tab-pane :tab="item.value" v-for="(item, index) in tabs" :key="index">
          <component :is="item.component" />
        </t-tab-pane>
      </t-tabs>
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
  </t-page>
</template>

<script setup lang="ts">
import { useMenu, useSortModal, useTabs } from './hooks'
import { SortEnum } from './enums'
import type { FormStateType } from './types.d'

const formState = reactive<FormStateType>({
  sort: SortEnum.createDesc,
  activeTabIndex: 0
})

const { currentSortValue, sortList, onSortChange } = useSortModal()
const { menu, onClickItem, sortVisible, setSortVisible } = useMenu({ formState, currentSortValue })
const { tabs, onClickTab } = useTabs({ formState })

const onSortSubmit = () => {
  formState.sort = currentSortValue.value
  setSortVisible(false)
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
