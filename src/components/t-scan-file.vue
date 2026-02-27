<template>
  <view class="t-scan-file">
    <view class="title">音乐源</view>
    <t-button type="info" @click="songStore.onScan">开始扫描</t-button>
  </view>
</template>
<script lang="ts" setup>
import { songStore } from '@/store/song'
</script>
<style scoped lang="less">
.t-scan-file {
  padding: 30rpx;
  font-size: 24rpx;
  .title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 120rpx;
  }
}
</style>
