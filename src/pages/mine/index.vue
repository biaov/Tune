<template>
  <t-page>
    <view class="mine">
      <view class="item" v-for="(item, index) in list" :key="index" @click="onClick(item)">
        <view class="name">{{ item.name }}</view>
        <view class="desc">{{ item.desc }}</view>
      </view>
    </view>
  </t-page>
</template>

<script setup lang="ts">
const list = [
  {
    name: '音乐源',
    desc: '管理音乐的加载位置',
    path: '/pages/mine/scan-file'
  },
  {
    name: '重新扫描音乐',
    desc: '重新扫描文件库, 可能需要一些时间',
    key: 'scan'
  }
]
const onClick = (item: (typeof list)[0]) => {
  if (!item.path) {
    switch (item.key) {
      case 'scan':
        songStore.onScan()
        break
    }
    return
  }
  uni.navigateTo({ url: item.path })
}
</script>

<style lang="less" scoped>
.mine {
  padding: 30rpx 0;
  .item {
    padding: 20rpx 30rpx;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    &:active {
      background: rgba(0, 0, 0, 0.02);
    }
    .name {
      font-size: 28rpx;
      font-weight: bold;
    }
    .desc {
      font-size: 24rpx;
      color: var(--color-text-2);
    }
  }
}
</style>
