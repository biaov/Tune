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
    <view class="w-full" style="padding-top: 80px">
      <view class="demo text-5xl text-red-500">测试</view>
    </view>
    <t-dropdown v-model:visible="sortVisible" @ok="onSortSubmit">
      <view class="dropdown-sort">
        <view class="title">排序方式</view>
        <radio-group @change="onSortChange">
          <view class="item" v-for="(item, index) in sortList" :key="index">
            <radio :value="item.value" :checked="formState.sort === item.value" />
            <text>{{ item.label }}</text>
          </view>
        </radio-group>
      </view>
    </t-dropdown>
  </t-page>
</template>

<script setup lang="ts">
import { useMenu, useSortModal } from './hooks'

const { menu, onClickItem, sortVisible } = useMenu()
const { defaultSortValue, currentSortValue, sortList, onSortChange } = useSortModal()

const formState = reactive({
  sort: defaultSortValue
})
const onSortSubmit = () => {
  formState.sort = currentSortValue.value
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
