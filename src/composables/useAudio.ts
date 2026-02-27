/**
 * 当前播放的音频 id
 */
let currentPlayId: string = ''

/**
 * 音频播放
 */
export const useAudio = () => {
  const playState = computed(() => songStore.state.isPlay)
  let bgAudioManager: UniApp.BackgroundAudioManager | null = null
  const initAudio = () => {
    if (!songStore.playItem.value) return
    if (bgAudioManager && currentPlayId === songStore.playItem.value.id) return // 避免重复初始化
    currentPlayId = songStore.playItem.value.id
    bgAudioManager = uni.getBackgroundAudioManager()
    bgAudioManager.title = songStore.playItem.value.name
    bgAudioManager.singer = songStore.playItem.value.artist
    bgAudioManager.src = songStore.playItem.value.audio
    bgAudioManager.coverImgUrl = songStore.playItem.value.url

    bgAudioManager.onPlay(() => {
      console.log('播放中')
    })

    bgAudioManager.onPause(() => {
      console.log('暂停')
    })

    bgAudioManager.onStop(() => {
      console.log('停止')
    })

    bgAudioManager.onEnded(() => {
      console.log('播放结束')
      bgAudioManager = null
      songStore.onPlayPrevNext(1)
    })

    bgAudioManager.onTimeUpdate(() => {
      if (!bgAudioManager) return
      const currentTime = ~~bgAudioManager.currentTime
      const duration = ~~bgAudioManager.duration
      console.log({ currentTime, duration })
      songStore.onUpdateDuration({ currentTime, duration })
    })

    bgAudioManager.onError(err => {
      if (!bgAudioManager) return
      songStore.onTogglePlay(false)
      bgAudioManager = null
      console.error('音频错误', err)
      useToast('播放失败')
    })
  }

  watch(
    playState,
    bool => {
      if (!songStore.playItem.value) return
      initAudio()
      if (!bgAudioManager) return
      if (bool) {
        bgAudioManager.seek(songStore.state.currentTime)
        bgAudioManager.play()
      } else {
        bgAudioManager.pause()
      }
    },
    { immediate: true }
  )
}
