/**
 * 排序枚举
 */
export enum SortEnum {
  /**
   * 按名称升序
   */
  nameAsc = 'name-asc',
  /**
   * 按名称倒序
   */
  nameDesc = 'name-desc',
  /**
   * 按歌手升序
   */
  authorAsc = 'author-asc',
  /**
   * 按歌手倒序
   */
  authorDesc = 'author-desc',
  /**
   * 按创建时间升序
   */
  createAsc = 'create-asc',
  /**
   * 按创建时间倒序
   */
  createDesc = 'create-desc'
}

/**
 * 标签枚举
 */
export enum TabEnum {
  /**
   * 歌曲标签
   */
  song = 'song',
  /**
   * 歌手标签
   */
  singer = 'singer',
  /**
   * 播放列表标签
   */
  playlist = 'playlist'
}
