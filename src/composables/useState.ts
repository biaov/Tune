/**
 * 值管理
 */
export const useState = <T = unknown>(initData: T) => {
  const data = ref<T>(initData)
  const setData = (newData: T) => {
    data.value = newData
  }
  return [data, setData] as const
}
