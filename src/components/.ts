import { ref } from 'vue'

const mp3List = ref<any[]>([]) // 存储扫描到的 mp3 文件信息

// 开始扫描
const scanMp3Files = () => {
  plus.io.requestFileSystem(
    plus.io.PUBLIC_DOCUMENTS,
    fs => {
      // fs.root.getFile('config.xml', { create: true }, function (fileEntry) {
      //   fileEntry.file(function (file) {
      //     var fileReader = new plus.io.FileReader()
      //     alert('getFile:' + JSON.stringify(file))
      //     fileReader.readAsText(file, 'utf-8')
      //     fileReader.onloadend = function (evt) {
      //       alert('11' + evt)
      //       alert('evt.target' + evt.target)
      //       alert(evt.target.result)
      //     }
      //     alert(file.size + '--' + file.name)
      //   })
      // })
      // 权限已获得，开始扫描
      const rootDir = plus.io.PUBLIC_DOCUMENTS // 私有目录（推荐）
      // 或用外部存储根目录（需权限）
      // const rootDir = plus.io.convertLocalFileSystemURL('_doc/') // 或 '_downloads/'

      scanDirectory(rootDir, files => {
        mp3List.value = files
        uni.showToast({ title: `找到 ${files.length} 首 MP3`, icon: 'success' })
      })
    },
    e => {
      console.log(e)
      uni.showToast({ title: '权限被拒绝', icon: 'error' })
    }
  )
}

// 递归扫描目录
const scanDirectory = (dirPath: string, callback: (files: any[]) => void) => {
  plus.io.resolveLocalFileSystemURL(
    dirPath,
    entry => {
      const reader = entry.createReader()
      const allFiles: any[] = []

      function readEntries() {
        reader.readEntries(
          entries => {
            if (entries.length === 0) {
              // 读取完毕，回调
              callback(allFiles)
              return
            }

            entries.forEach((entry: any) => {
              if (entry.isFile) {
                // 是文件，判断是否 MP3
                if (entry.name.toLowerCase().endsWith('.mp3')) {
                  entry.file((file: any) => {
                    allFiles.push({
                      name: file.name,
                      path: entry.toLocalURL(),
                      size: file.size,
                      lastModified: file.lastModifiedDate
                    })
                  })
                }
              } else if (entry.isDirectory) {
                // 是目录，继续递归
                scanDirectory(entry.toLocalURL(), subFiles => {
                  allFiles.push(...subFiles)
                })
              }
            })

            readEntries() // 继续读取下一个批次
          },
          e => {
            console.error('读取目录失败', e)
            callback(allFiles)
          }
        )
      }

      readEntries()
    },
    e => {
      console.error('解析目录失败', e)
      callback([])
    }
  )
}

// 格式化文件大小（可选）
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}
