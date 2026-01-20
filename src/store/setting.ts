const settingState = reactive({
  dirList: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    path: `文件夹/子文件夹/文件${index + 1}`
  })),
  scanTabIndex: 0 // 当前扫描标签索引
})

const updateScanTabIndex = (index: number) => {
  settingState.scanTabIndex = index
}
const removeDirList = (index: number) => {
  settingState.dirList.splice(index, 1)
}

export const settingStore = { state: readonly(settingState), updateScanTabIndex, removeDirList }
