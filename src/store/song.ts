const songState = reactive({
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
   * 当前播放进度, 0 - 100
   */
  progress: 0
})

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
  uni.showLoading({ title: '扫描中...' })
  try {
    const res = await useScanDir()
    console.log(res, '--res')
    songState.songs = res
  } catch (error) {
    console.log(error, '--error')
  } finally {
    uni.hideLoading()
    useToast('扫描完成')
  }
}

const duration = computed(() => playItem.value?.duration || 0)
const currentSecond = computed(() => ~~((songState.progress * duration.value) / 100) || 0)

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

/**
 * 更新播放进度
 */
const onUpdateDuration = ({ currentTime, duration }: { currentTime: number; duration: number }) => {
  songState.progress = ~~((currentTime / duration) * 100)
  if (playItem.value?.duration) return
  songState.songs.find(item => item.id === songState.playId)!.duration = duration
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
  onTogglePlay,
  onPlayPrevNext,
  onUpdatePlayType,
  onUpdateDuration
}
