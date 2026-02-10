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

watch(
  settingState,
  value => {
    setStorage(StorageKeyEnum.setting, value)
  },
  { immediate: true }
)

export const settingStore = { state: readonly(settingState), updateScanTabIndex, removeDirList }
