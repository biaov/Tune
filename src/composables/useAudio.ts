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
    if (bgAudioManager) {
      // 避免重复初始化
      if (currentPlayId === songStore.state.playId) return
      bgAudioManager.stop()
    } else {
      bgAudioManager = uni.getBackgroundAudioManager()
    }
    currentPlayId = songStore.playItem.value.id
    bgAudioManager.title = songStore.playItem.value.name
    bgAudioManager.singer = songStore.playItem.value.artist
    bgAudioManager.src = songStore.playItem.value.audio
    bgAudioManager.coverImgUrl = songStore.playItem.value.url

    // bgAudioManager.onPlay(() => {
    //   console.log('播放中')
    // })

    // bgAudioManager.onPause(() => {
    //   console.log('暂停')
    // })

    // bgAudioManager.onStop(() => {
    //   console.log('停止')
    // })

    bgAudioManager.onEnded(() => {
      // console.log('播放结束')
      bgAudioManager = null
      songStore.onPlayPrevNext(1)
    })

    bgAudioManager.onTimeUpdate(() => {
      if (!bgAudioManager) return
      const currentTime = ~~bgAudioManager.currentTime
      const duration = ~~bgAudioManager.duration
      if (!duration) {
        songStore.onTogglePlay(false)
        useToast('播放失败')
        return
      }
      songStore.onUpdateDuration({ currentTime, duration })
    })

    bgAudioManager.onError(err => {
      if (!bgAudioManager) return
      songStore.onTogglePlay(false)
      // console.error('音频错误', err)
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

/**
 * 删除文件
 */
export const useRemoveFile = (id: string) => {
  const invoke = plus.android.invoke as (obj: string | PlusAndroidClassObject | PlusAndroidInstanceObject, name: string, ...args: unknown[]) => any
  const activity = plus.android.runtimeMainActivity()
  const contentResolver = invoke(activity, 'getContentResolver')
  plus.android.importClass('android.provider.MediaStore')
  plus.android.importClass('java.lang.Long')
  // 直接拼字符串
  const mediaUri = invoke('android.net.Uri', 'parse', `content://media/external/audio/media/${id}`)
  const ArrayList = plus.android.importClass('java.util.ArrayList') as unknown as new () => string
  const uriList = new ArrayList()
  invoke(uriList, 'add', mediaUri)
  const pendingIntent = invoke('android.provider.MediaStore', 'createDeleteRequest', contentResolver, uriList)
  const intentSender = invoke(pendingIntent, 'getIntentSender') as unknown
  invoke(activity, 'startIntentSenderForResult', intentSender, 42, null, 0, 0, 0)
}
