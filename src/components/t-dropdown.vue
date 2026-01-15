<template>
  <view class="t-dropdown" :class="`${visible ? 'show' : ''}`" @click="onClose">
    <view class="content">
      <slot></slot>
      <view class="footer-button">
        <view class="btn btn-cancel" @click="onClose">取消</view>
        <view class="btn btn-primary" @click="onOk">确定</view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'ok'): void
}>()
const visible = defineModel<boolean>('visible', { default: false })

const onClose = () => {
  visible.value = false
}

const onOk = () => {
  emit('ok')
}
</script>
<style scoped lang="less">
.t-dropdown {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: none;
  transition: all 0.3s allow-discrete;
  background: rgba(#000, 0);
  .content {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 20rpx 20rpx 0 0;
    background: #fff;
    transform: translateY(100%);
    transition: all 0.3s;
    .footer-button {
      display: flex;
      justify-content: space-around;
      padding: 30rpx;
      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300rpx;
        height: 80rpx;
        font-size: 24rpx;
        border: 1px solid;
        border-radius: 10rpx;
        &-cancel {
          color: #999;
          border-color: #999;
        }
        &-primary {
          color: #fff;
          border-color: var(--theme-primary);
          background: var(--theme-primary);
        }
      }
    }
  }
  &.show {
    display: block;
    background: rgba(#000, 0.6);
    .content {
      transform: translateY(0%);
    }
  }
}
@starting-style {
  .t-dropdown.show {
    background: rgba(#000, 0);
    .content {
      transform: translateY(100%);
    }
  }
}
</style>
