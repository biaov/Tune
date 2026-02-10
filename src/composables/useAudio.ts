/**
 * 音频播放
 */
export const useAudio = () => {
  const playState = computed(() => songStore.state.isPlay)
  let bgAudioManager: UniApp.BackgroundAudioManager | null = null
  const initAudio = () => {
    if (bgAudioManager) return // 避免重复初始化
    if (!songStore.playItem.value) return
    bgAudioManager = uni.getBackgroundAudioManager()
    bgAudioManager.title = songStore.playItem.value.name
    bgAudioManager.singer = songStore.playItem.value.artist
    bgAudioManager.coverImgUrl = songStore.playItem.value.url

    // 设置音频源（可动态修改）
    bgAudioManager.src = songStore.playItem.value.audio

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
      songStore.onUpdateDuration({ currentTime, duration })
    })

    bgAudioManager.onError(err => {
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
        bgAudioManager.pause()
      } else {
        bgAudioManager.play()
      }
    },
    { immediate: true }
  )
}
