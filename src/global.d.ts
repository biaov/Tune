/**
 * 歌曲项类型
 */
interface SongItemType {
  id: number
  name: string
  artist: string
  url: string
}

declare global {
  export type { SongItemType }
}
