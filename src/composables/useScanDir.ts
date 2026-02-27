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
        console.log(e, '---e')
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
 * 扫描目录 - old
 */
const useScanAndroidDir = (dirPath: string): Promise<SongItemType[]> => {
  const preset: SongItemType[] = []
  return new Promise(async resolve => {
    plus.io.resolveLocalFileSystemURL(
      dirPath,
      entry => {
        if (!entry.isDirectory) {
          resolve(preset)
          return
        }
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
                console.log(name, '--name')
                const audioInfo = await useReadyAudio(entry)
                console.log(audioInfo, '--audioInfo')
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
            console.log(preset, '--preset')
            resolve(preset)
          },
          useToast.bind(null, '读取失败')
        )
      },
      resolve.bind(null, preset)
    )
  })
}

/**
 * 扫描 Android 目录
 * latest
 */
export const useScanAndroidDirs = async (): Promise<SongItemType[]> => {
  try {
    // 导入需要的 Java 类（必须先 importClass）
    // const Activity = plus.android.importClass('android.app.Activity')
    // const Context = plus.android.importClass('android.content.Context')
    const MediaStore = plus.android.importClass('android.provider.MediaStore') as unknown as MediaStoreType
    // const Uri = plus.android.importClass('android.net.Uri') as unknown as {
    //   parse: (str: string) => unknown
    // }
    // const ContentUris = plus.android.importClass('android.content.ContentUris') as unknown as {
    //   withAppendedId: (uri: unknown, id: number) => string
    // }
    // const Cursor = plus.android.importClass('android.database.Cursor')
    // 获取当前 Activity 和 ContentResolver
    const mainActivity = plus.android.runtimeMainActivity() as unknown as { getContentResolver: () => PlusAndroidInstanceObject }
    const contentResolver = mainActivity.getContentResolver() // 这返回 Java 对象代理
    // MediaStore URI
    const audioUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
    // 投影列（要查询的字段）
    const projection = [
      MediaStore.Audio.Media._ID,
      MediaStore.Audio.Media.DISPLAY_NAME,
      MediaStore.Audio.Media.TITLE,
      MediaStore.Audio.Media.ARTIST,
      MediaStore.Audio.Media.ALBUM,
      MediaStore.Audio.Media.ALBUM_ID,
      MediaStore.Audio.Media.DATA,
      MediaStore.Audio.Media.DURATION,
      MediaStore.Audio.Media.SIZE
    ]
    // 可选：过滤只查询音乐（非铃声/通知音等），IS_MUSIC=1
    const selection = `${MediaStore.Audio.Media.IS_MUSIC} = 1`
    // 执行查询：用 plus.android.invoke 调用 Java 方法
    const cursor = (plus.android.invoke as (obj: string | PlusAndroidClassObject | PlusAndroidInstanceObject, name: string, ...args: unknown[]) => any)(
      contentResolver,
      'query',
      audioUri,
      projection,
      selection,
      null,
      null
    )
    const audioList: SongItemType[] = []
    if (!cursor) {
      return []
    }

    // 移动游标并读取（同样用 invoke 调用 Cursor 方法）
    while (plus.android.invoke(cursor, 'moveToNext')) {
      const id = plus.android.invoke(cursor, 'getLong', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media._ID))

      const name = plus.android.invoke(cursor, 'getString', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.DISPLAY_NAME))

      // const title = plus.android.invoke(cursor, 'getString', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.TITLE))

      const artist = plus.android.invoke(cursor, 'getString', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.ARTIST))

      const path = plus.android.invoke(cursor, 'getString', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.DATA))
      const duration = plus.android.invoke(cursor, 'getLong', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.DURATION))
      const album = plus.android.invoke(cursor, 'getString', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.ALBUM))
      // const albumId = plus.android.invoke(cursor, 'getLong', plus.android.invoke(cursor, 'getColumnIndexOrThrow', MediaStore.Audio.Media.ALBUM_ID))
      // let albumArtUri = null
      // if (albumId > 0) {
      //   const baseUri = Uri.parse('content://media/external/audio/albumart')
      //   albumArtUri = ContentUris.withAppendedId(baseUri, albumId).toString() // 转为字符串 URI
      // }

      audioList.push({
        id: `${id}`,
        name,
        artist: artist && artist !== '<unknown>' ? artist : '未知',
        url: '/static/default-cover.svg', // albumArtUri || '',
        audio: `file://${path}`,
        createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        duration,
        album: album || '未知'
      })
    }

    // 关闭游标（重要，避免内存泄漏）
    plus.android.invoke(cursor, 'close')
    return audioList
  } catch (e) {
    console.error('MediaStore 查询异常：' + (e as Error))
    return []
  }
}

/**
 * 扫描 Android 目录
 */
export const useScanDir = (): Promise<SongItemType[]> => {
  return new Promise(resolve => {
    plus.android.requestPermissions(
      ['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.READ_MEDIA_AUDIO'],
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
        useScanAndroidDirs().then(resolve)
        /*
         const dirPaths = ['Download', 'Documents', 'Pictures', 'DCIM', 'Movies', 'Music', 'Ringtones'].map(item => useScanAndroidDir(`file:///storage/emulated/0/${item}`))

        // 读取目录
        Promise.all(dirPaths).then(data => {
          resolve(data.flat())
        })
           */
      },
      () => {
        uni.showModal({ title: '提示', content: '权限申请失败', showCancel: false })
      }
    )
  })
}
