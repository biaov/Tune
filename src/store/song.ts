const initData = () => ({
  /**
   * 歌曲列表
   */
  songs: getStorage<SongItemType[]>(StorageKeyEnum.songState, []),
  /**
   * 当前播放的歌曲 id
   */
  playId: '',
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
   * 当前播放时间
   */
  currentTime: 0
})
const songState = reactive(initData())

watch(
  () => songState.songs,
  value => {
    setStorage(StorageKeyEnum.songState, value)
  },
  { immediate: true }
)

const onUpdatePlayId = (id: string, isPlay = true) => {
  songState.playId = id
  songState.isPlay = isPlay
}

const removeSong = (id: string) => {
  songState.songs = songState.songs.filter(item => item.id !== id)
}

const playItem = computed(() => songState.songs.find(item => item.id === songState.playId))

const onUpdateSortType = (type: SortEnum) => {
  songState.sortType = type
}

const onScan = async () => {
  uni.showLoading({ title: '扫描中...', mask: true })
  try {
    const res = await useScanDir()
    songState.songs = res
  } catch (error) {
    console.log(error, '--error')
  } finally {
    uni.hideLoading()
    useToast('扫描完成')
  }
}

const duration = computed(() => playItem.value?.duration || 0)
const progress = computed(() => +((songState.currentTime / duration.value) * 100).toFixed(2))
const currentSecond = computed(() => ~~(songState.currentTime / 100) || 0)

const onUpdateProgress = (newProgress: number) => {
  songState.currentTime = Math.round((newProgress / 100) * duration.value)
}

/**
 * 切换播放暂停
 */
const onTogglePlay = (value?: boolean) => {
  if (!songStore.state.songs.length) {
    useToast('请先添加歌曲')
    return
  }
  if (!songState.playId) {
    useToast('请先选择要播放的歌曲')
    return
  }
  songState.isPlay = value ?? !songState.isPlay
}
/**
 * 播放下一首
 */
const onPlayPrevNext = (value: 1 | -1) => {
  if (!songStore.state.songs.length) {
    useToast('请先添加歌曲')
    return
  }
  onTogglePlay(false)
  songState.currentTime = 0
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
}

/**
 * 更新播放类型
 */
const onUpdatePlayType = (type: PlayTypeEnum) => {
  songState.playType = type
}

/**
 * 更新播放进度
 */
const onUpdateDuration = ({ currentTime, duration }: { currentTime: number; duration: number }) => {
  songState.currentTime = currentTime
  if (playItem.value?.duration) return
  songState.songs.find(item => item.id === songState.playId)!.duration = duration
}

let cacheTimer: number | null = null
/**
 * 清除缓存
 */
const onClearCache = () => {
  uni.showLoading({ title: '清除中...', mask: true })
  removeStorage(StorageKeyEnum.songState)
  Object.assign(songState, initData())
  // 重置内容
  songState.songs = []
  songState.playId = ''
  songState.isPlay = false
  songState.currentTime = 0

  clearTimeout(cacheTimer as number)
  cacheTimer = setTimeout(() => {
    uni.hideLoading()
    useToast('清除缓存成功')
  }, 1000)
}

export const songStore = {
  state: readonly(songState),
  onUpdatePlayId,
  removeSong,
  playItem,
  onUpdateSortType,
  onScan,
  onUpdateProgress,
  currentSecond,
  duration,
  progress,
  onTogglePlay,
  onPlayPrevNext,
  onUpdatePlayType,
  onUpdateDuration,
  onClearCache
}
