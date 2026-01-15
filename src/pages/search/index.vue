<template>
  <view class="fixed w-full left-0 top-0 px-30">
    <view class="flex items-center justify-between">
      <view class="text-3xl font-bold text-black">Tune</view>
      <view class="flex">
        <view v-for="(item, index) in menu" :key="index"></view>
      </view>
    </view>
  </view>
  <view class="w-full">
    <view></view>
  </view>
</template>

<script setup lang="ts">
const menu = [
  {
    path: '/pages/search/index',
    icon: '/static/search.svg'
  }
]
</script>

<style lang="less" scoped></style>
