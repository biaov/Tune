/**
 * 获取 key
 */
const getKey = (key: string) => `$${key}`

/**
 * 设置缓存
 */
export const setStorage = <T>(key: string, value: T) => uni.setStorageSync(getKey(key), JSON.stringify({ value }))

/**
 * 获取缓存
 */
export const getStorage = <T>(key: string, defaultValue?: T): T => {
  const value = uni.getStorageSync(getKey(key))
  return value && value.includes('value') ? JSON.parse(value).value : defaultValue as T
}

/**
 * 清理指定缓存
 */
export const removeStorage = (key: string) => uni.removeStorageSync(getKey(key))
