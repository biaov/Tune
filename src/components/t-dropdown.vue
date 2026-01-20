<template>
  <view class="t-dropdown" :class="`${visible ? 'show' : ''}`" @click="onClose">
    <view class="content" @click.stop>
      <slot></slot>
      <slot name="footer"></slot>
      <view class="footer-button" v-if="!slot.footer">
        <t-button width="300rpx" type="info" @click="onClose">取消</t-button>
        <t-button width="300rpx" type="primary" @click="onOk">确定</t-button>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'ok'): void
}>()
const slot = defineSlots<{
  default?: () => void
  footer?: () => void
}>()
const visible = defineModel<boolean>('visible', { default: false })

const onClose = () => {
  visible.value = false
}

const onOk = () => {
  emit('ok')
}
const instance = getCurrentInstance()
onMounted(() => {
  document.querySelector('.t-page')!.appendChild(instance!.proxy!.$el)
})
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
      justify-content: space-between;
      padding: 40rpx;
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
