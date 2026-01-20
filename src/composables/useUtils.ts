/**
 * 弹窗工具函数
 */
export const useToast = (title: string) => {
  uni.showToast({ title, icon: 'none', mask: true })
}
