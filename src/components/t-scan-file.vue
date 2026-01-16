<template>
  <view class="t-scan-file">
    <view class="title">音乐源</view>
    <view class="tabs">
      <view class="item" :class="{ active: settingStore.state.scanTabIndex === index }" v-for="(item, index) in tabs" :key="index" @click="settingStore.updateScanTabIndex(index)">
        {{ item.label }}
      </view>
    </view>
    <view class="tips">{{ tabs[settingStore.state.scanTabIndex]!.tips }}</view>
    <view class="card-source">
      <template v-if="!settingStore.state.scanTabIndex">
        <view class="head">
          <view class="head__label">要加载的文件夹</view>
          <t-icon name="plus" width="80rpx" height="80rpx" icon-size="30rpx" />
        </view>
        <view class="dir-list">
          <view class="item" v-for="(item, index) in settingStore.state.dirList" :key="index">
            <view>{{ item.path }}</view>
            <t-icon name="delete" width="80rpx" height="60rpx" icon-size="30rpx" @click="settingStore.removeDirList(index)" />
          </view>
        </view>
        <view class="border"></view>
      </template>
    </view>
    <t-button type="info">开始扫描</t-button>
  </view>
</template>
<script lang="ts" setup>
import { settingStore } from '@/store/setting'

const tabs = [
  {
    label: '自定义目录',
    tips: '手动添加要加载的文件夹，较快'
  },
  {
    label: '全部目录',
    tips: '加载所有文件夹，较慢'
  }
]
</script>
<style scoped lang="less">
.t-scan-file {
  padding: 30rpx;
  font-size: 24rpx;
  .title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  .tabs {
    display: flex;
    height: 80rpx;
    border: 1px solid #999;
    border-radius: 40rpx;
    overflow: hidden;
    margin: 0 auto;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      height: 100%;
      color: #999;
      transition: all 0.2s;
      &:first-child {
        border-right: 1px solid #999;
      }
      &.active {
        background: rgba(#000, 0.02);
        color: var(--theme-primary);
      }
    }
  }
  .tips {
    padding: 20rpx 0 30rpx;
    color: #999;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  .card-source {
    width: 100%;
    margin-bottom: 40rpx;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 80rpx;
      .head__label {
        color: #999;
      }
    }
    .dir-list {
      min-height: 100rpx;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rpx 0;
        border-top: 1px dashed rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
