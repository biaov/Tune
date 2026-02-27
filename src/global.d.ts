/**
 * 歌曲项类型
 */
interface SongItemType {
  /**
   * 歌曲 ID
   */
  id: string
  /**
   * 歌曲名称
   */
  name: string
  /**
   * 歌手
   */
  artist: string
  /**
   * 封面 URL
   */
  url: string
  /**
   * 音频 URL
   */
  audio: string
  /**
   * 创建时间
   */
  createdTime: string
  /**
   * 时长（秒）
   */
  duration: number
  /**
   * 专辑
   */
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
interface MediaStoreType {
  Audio: {
    Media:{
      EXTERNAL_CONTENT_URI: string
      _ID: number
      DISPLAY_NAME: string
      TITLE: string
      ARTIST: string
      ALBUM: string
      DATA: string
      DURATION: number
      SIZE: number
      IS_MUSIC: number
      ALBUM_ID: number
    }
  }
}

declare global {
  export type { SongItemType, AndroidSetting, MediaStoreType }
}
