const songState = reactive({
  /**
   * 歌曲列表
   */
  songs: Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `歌曲${index + 1}`,
    artist: `歌手${index + 1}`,
    url: `https://dummyimage.com/100x100/f60&text=歌曲${index + 1}`,
    createdTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss')
  })),
  /**
   * 当前播放的歌曲 id
   */
  playId: 0,
  /**
   * 是否正在播放
   */
  isPlay: false,
  /**
   * 播放类型
   */
  playType: PlayTypeEnum.sequence,
  /**
   * 排序类型
   */
  sortType: SortEnum.createDesc
})

const onUpdatePlayId = (id: number, isPlay = true) => {
  songState.playId = id
  songState.isPlay = isPlay
}

const removeSong = (id: number) => {
  songState.songs = songState.songs.filter(item => item.id !== id)
}

const playItem = computed(() => songState.songs.find(item => item.id === songState.playId))

const onUpdatePlay = () => {
  if (!songState.playId) {
    useToast('请先选择要播放的歌曲')
    return
  }
  songState.isPlay = !songState.isPlay
}

const onNextSong = () => {
  if (!songState.songs.length) {
    useToast('暂无下一首歌曲')
    return
  }
  let index: number
  switch (songState.playType) {
    case PlayTypeEnum.loop:
    case PlayTypeEnum.sequence:
      index = songState.playId ? songState.songs.findIndex(item => item.id === songState.playId) : 0
      if (index === songState.songs.length - 1) {
        index = 0
      } else {
        index++
      }
      break
    case PlayTypeEnum.random:
      index = ~~(Math.random() * songState.songs.length)
      break
  }
  onUpdatePlayId(songState.songs[index]!.id)
}

const artistList = computed(() => songState.songs.toSorted((a, b) => a.artist.localeCompare(b.artist, 'zh-CN')))

const onUpdateSortType = (type: SortEnum) => {
  songState.sortType = type
}

export const songStore = {
  state: readonly(songState),
  artistList: readonly(artistList),
  onUpdatePlayId,
  removeSong,
  playItem,
  onUpdatePlay,
  onNextSong,
  onUpdateSortType
}
