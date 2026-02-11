const storage = getStorage<{
  dirList: DirItem[]
  scanTabIndex: number
}>(StorageKeyEnum.setting, {
  dirList: [], // 目录列表
  scanTabIndex: 0 // 当前扫描标签索引
})
const settingState = reactive(storage)

const updateScanTabIndex = (index: number) => {
  settingState.scanTabIndex = index
}
const removeDirList = (index: number) => {
  settingState.dirList.splice(index, 1)
}
const addDirList = () => {
  plus.android.requestPermissions(['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE'], result => {
    // 获取当前 Activity
    const Activity = plus.android.runtimeMainActivity()
    // 创建 Intent：打开文档树选择器
    const Intent = plus.android.importClass('android.content.Intent')
    const intent = new Intent('android.intent.action.OPEN_DOCUMENT_TREE')
    // 可选：添加额外标志
    // 启动选择器，requestCode 自定义（这里用 1001）
    Activity.startActivityForResult(intent, 1001)
    Activity.onActivityResult = (requestCode, resultCode, intent) => {
      console.log('onActivityResult 被拦截到：', {
        requestCode,
        resultCode,
        intent: intent ? '有 intent' : '无 intent'
      })

      // 判断是我们启动的请求（requestCode 自定义，比如 1001）
      if (requestCode === 1001) {
        if (resultCode === -1) {
          // RESULT_OK = -1，表示用户确认选择
          try {
            const uri = intent.getData()
            const path = uri ? uri.toString() : null

            console.log('用户选择的目录 URI：', path)
          } catch (e) {
            console.error('处理返回结果出错：', e)
          }
        } else {
          console.log('用户取消或失败，resultCode：', resultCode)
        }
      }
    }
  })
  // // 权限已授权，弹出系统目录选择器
  // plus.android.chooseDirectory(
  //   dirPath => {
  //     console.log('用户选择的目录：', dirPath)
  //   },
  //   e => {
  //     console.error('选择目录失败：', e)
  //   }
  // )
}

watch(
  settingState,
  value => {
    setStorage(StorageKeyEnum.setting, value)
  },
  { immediate: true }
)

export const settingStore = { state: readonly(settingState), updateScanTabIndex, removeDirList, addDirList }
