/**
 * 弹窗工具函数
 */
export const useToast = (title: string) => {
  uni.showToast({ title, icon: 'none', mask: true })
}

/**
 * 时间秒数转换为显示的时间格式
 */
export const useSecondToTime = (second: number) => {
  const m = ~~(second / 60)
  const s = ~~(second % 60)
  // return `${m}:${s < 10 ? '0' : ''}${s}`
  return `${m}:${s.toString().padStart(2, '0')}`
}
