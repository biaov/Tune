import parse from 'id3-parser'

type IID3Tag = Exclude<ReturnType<typeof parse>, false>

/**
 * 获取总时长
 */
const useGerDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    plus.io.getAudioInfo({
      filePath,
      success: res => {
        resolve(res.duration)
      },
      fail: reject
    })
  })
}

/**
 * 计算图片信息数据
 */
const useCalcImage = (image?: IID3Tag['image']) => {
  if (!image?.data) return
  const base64Str = Object.values(image.data).reduce((prev, item) => prev + String.fromCharCode(item), '')
  return `data:${image.mime};base64,${btoa(base64Str)}`
}

/**
 * 读取音频信息
 */
const useReadyAudio = async (
  entry: PlusIoDirectoryEntry
): Promise<{
  title?: string
  image?: string
  artist?: string
  duration?: number
  album?: string
}> => {
  return new Promise((resolve, reject) => {
    ;(entry as unknown as { file: (file: (file: PlusIoFile) => void) => void }).file(file => {
      const reader = new plus.io.FileReader()
      reader.onloadend = async e => {
        const dataUrl = (e.target as unknown as { result: string }).result
        const base64 = dataUrl.split(',')[1] as string
        const binary = atob(base64)
        const len = binary.length
        const bytes = new Uint8Array(len)

        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        try {
          const [audioInfo, duration] = await Promise.all([parse(bytes), useGerDuration(entry.fullPath!)])
          if (!audioInfo) {
            reject('内容读取失败')
            return
          }
          const { album, artist, title, image } = audioInfo
          const result = { album, artist, title, duration, image: useCalcImage(image) }
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  })
}

/**
 * 扫描目录
 */
export const useScanAndroidDir = (dirPath: string): Promise<SongItemType[]> => {
  const preset: SongItemType[] = []
  return new Promise(async resolve => {
    plus.io.resolveLocalFileSystemURL(dirPath, entry => {
      if (!entry.isDirectory) return
      const dirReader = entry.createReader()
      dirReader.readEntries(
        async entries => {
          const taskPromie = (entries as unknown as PlusIoDirectoryEntry[]).map(async entry => {
            // 递归子目录
            if (entry.isDirectory) {
              const result = await useScanAndroidDir(entry.fullPath!)
              preset.push(...result)
              return
            }

            if (entry.isFile) {
              if (songStore.state.songs.some(item => item.audio === entry.fullPath)) return
              const name = entry.name!
              const nameLower = name.toLowerCase()
              if (!nameLower.endsWith('.mp3')) return
              const audioInfo = await useReadyAudio(entry)
              preset.push({
                id: entry.fullPath + nameLower,
                name: audioInfo.title || name.slice(0, -4) || '未知',
                url: '/static/default-cover.svg', // audioInfo.image || '/static/default-cover.svg',
                artist: audioInfo.artist || '未知',
                duration: audioInfo.duration || 0,
                audio: entry.fullPath!,
                album: audioInfo.album || '未知',
                createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
              })
            }
          })
          await Promise.all(taskPromie)
          resolve(preset)
          // p = plus.audio.createPlayer( "_Doc/Audio/test.mp3")
        },
        useToast.bind(null, '读取失败')
      )
    })
  })
}

/**
 * 扫描 Android 目录
 */
export const useScanDir = (): Promise<SongItemType[]> => {
  return new Promise(resolve => {
    plus.android.requestPermissions(
      ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'],
      res => {
        // 存在未授权权限
        if (res.deniedPresent.length) {
          uni.showModal({
            title: '提示',
            content: '需要存储权限才能继续，是否重新申请？',
            success: res => {
              if (res.cancel) return
              useScanDir()
            }
          })
          return
        }
        // 存在永久拒绝权限
        if (res.deniedAlways.length) {
          uni.showModal({
            title: '提示',
            content: '永久拒绝存储权限，无法继续，是否去设置？',
            success: res => {
              if (res.cancel) return
              try {
                const main = plus.android.runtimeMainActivity() as AndroidSetting.PlusAndroidInstanceObjectExtra
                const Intent = plus.android.importClass('android.content.Intent') as AndroidSetting.PlusAndroidClassObjectExtra
                const Settings = plus.android.importClass('android.provider.Settings') as AndroidSetting.Setting
                const Uri = plus.android.importClass('android.net.Uri') as AndroidSetting.URI
                const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                const uri = Uri.fromParts('package', main.getPackageName(), null)
                intent.setData(uri)
                main.startActivity(intent)
              } catch {
                useToast('无法打开设置页')
              }
            }
          })
          return
        }
        // // 读取目录
        useScanAndroidDir('/storage/emulated/0/Music').then(resolve)
      },
      () => {
        uni.showModal({ title: '提示', content: '权限申请失败', showCancel: false })
      }
    )
  })
}
