/**
 * 歌曲项类型
 */
interface SongItemType {
  id: string
  name: string
  artist: string
  url: string
  audio: string
  createdTime: string
  duration: number
  album: string
}

/**
 * 目录选项
 */
interface DirItem {
  id: string
  path: string
}

/**
 * Android 设置相关类型定义
 */
namespace AndroidSetting {
  export interface PlusAndroidInstanceObjectExtra extends PlusAndroidInstanceObject {
    getPackageName: () => string
    startActivity: (intent: PlusAndroidClassObject) => void
  }
  export interface Setting extends PlusAndroidClassObject {
    ACTION_APPLICATION_DETAILS_SETTINGS: string
  }
  export interface PlusAndroidClassObjectExtra extends PlusAndroidClassObject {
    new (arg: string): PlusAndroidClassObject & { setData: (option: URI) => unknown }
  }
  export interface URI extends PlusAndroidClassObject {
    fromParts: (scheme: string, packageName: string, path: null | string) => URI
  }
}

declare global {
  export type { SongItemType, AndroidSetting }
}
