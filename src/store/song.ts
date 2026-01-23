const songState = reactive({
  /**
   * 歌曲列表
   */
  songs: Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `歌曲${index + 1}`,
    artist: `歌手${index + 1}`,
    url: `https://dummyimage.com/100x100/f60&text=歌曲${index + 1}`,
    audio: `https://dummyimage.com/100x100/f60&text=歌曲${index + 1}`,
    createdTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
    totalSecond: ~~(Math.random() * 300)
  })),
  /**
   * 当前播放的歌曲 id
   */
  playId: 1,
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
  sortType: SortEnum.createDesc,
  /**
   * 当前播放进度, 0 - 100
   */
  progress: 0
})

const onUpdatePlayId = (id: number, isPlay = true) => {
  songState.playId = id
  songState.isPlay = isPlay
}

const removeSong = (id: number) => {
  songState.songs = songState.songs.filter(item => item.id !== id)
}

const playItem = computed(() => songState.songs.find(item => item.id === songState.playId))

const artistList = computed(() => songState.songs.toSorted((a, b) => a.artist.localeCompare(b.artist, 'zh-CN')))

const onUpdateSortType = (type: SortEnum) => {
  songState.sortType = type
}

const onScan = () => {
  uni.showLoading({ title: '扫描中...' })
  setTimeout(() => {
    uni.hideLoading()
    useToast('扫描完成')
  }, 3000)
}

const totalSecond = computed(() => playItem.value?.totalSecond || 0)
const currentSecond = computed(() => ~~((songState.progress * totalSecond.value) / 100) || 0)

const onUpdateProgress = (progress: number) => {
  songState.progress = progress
}

/**
 * 切换播放暂停
 */
const onTogglePlay = (isForcePlay = false) => {
  if (!songStore.state.songs.length) {
    useToast('请先添加歌曲')
    return
  }
  if (!songState.playId) {
    useToast('请先选择要播放的歌曲')
    return
  }
  if (isForcePlay) {
    songState.isPlay = true
    return
  }

  songState.isPlay = !songState.isPlay
}
/**
 * 播放下一首
 */
const onPlayPrevNext = (value: 1 | -1) => {
  if (!songStore.state.songs.length) {
    useToast('请先添加歌曲')
    return
  }
  let index = 0
  if (songState.playType === PlayTypeEnum.random) {
    index = ~~(Math.random() * songState.songs.length)
  } else if (playItem.value) {
    index = songState.songs.findIndex(item => item.id === songState.playId) + value
    if (index >= songState.songs.length) {
      index = 0
    } else if (index < 0) {
      index = songState.songs.length - 1
    }
  }

  onUpdatePlayId(songState.songs[index]!.id)
  onTogglePlay(true)
}

/**
 * 更新播放类型
 */
const onUpdatePlayType = (type: PlayTypeEnum) => {
  songState.playType = type
}

export const songStore = {
  state: readonly(songState),
  artistList: readonly(artistList),
  onUpdatePlayId,
  removeSong,
  playItem,
  onUpdateSortType,
  onScan,
  onUpdateProgress,
  currentSecond,
  totalSecond,
  onTogglePlay,
  onPlayPrevNext,
  onUpdatePlayType
}
