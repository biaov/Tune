<template>
  <view class="pane-singer" v-if="list.length">
    <view class="title">歌手列表</view>
  </view>
  <t-scan-file v-else />
</template>

<script lang="ts" setup>
const list = Array.from({ length: 0 }, (_, index) => ({
  id: index,
  name: `歌曲${index + 1}`,
  artist: `歌手${index + 1}`
}))
</script>

<style scoped lang="less">
.pane-singer {
  height: 50vh;
}
</style>
