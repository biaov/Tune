/**
 * 播放类型枚举
 */
export enum PlayTypeEnum {
  /**
   * 顺序播放
   */
  sequence = 'sequence',
  /**
   * 随机播放
   */
  random = 'random',
  /**
   * 循环播放
   */
  loop = 'loop'
}

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
  artistAsc = 'artist-asc',
  /**
   * 按歌手倒序
   */
  artistDesc = 'artist-desc',
  /**
   * 按创建时间升序
   */
  createAsc = 'create-asc',
  /**
   * 按创建时间倒序
   */
  createDesc = 'create-desc'
}
