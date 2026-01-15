import type { RadioGroupOnChangeEvent } from '@uni-helper/uni-app-types'
import type { USEMenuOption, USETabsOption } from './types.d'
import { SortEnum, TabEnum } from './enums'
import PaneSong from './components/pane-song.vue'
import PaneSinger from './components/pane-singer.vue'
import PanePlaylist from './components/pane-playlist.vue'

/**
 * 菜单
 */
export const useMenu = ({ formState, currentSortValue }: USEMenuOption) => {
  const menu = [
    {
      path: '/pages/search/index',
      icon: '/static/search.svg'
    },
    {
      icon: '/static/sort.svg',
      key: 'sort'
    },
    {
      path: '/pages/mine/index',
      icon: '/static/setting.svg'
    }
  ]

  const [sortVisible, setSortVisible] = useState(false)

  const onClickItem = (item: (typeof menu)[0]) => {
    if (item.path) {
      uni.navigateTo({ url: item.path })
      return
    }

    switch (item.key) {
      case 'sort':
        currentSortValue.value = formState.sort
        setSortVisible(true)
        break
    }
  }

  return { menu, onClickItem, sortVisible, setSortVisible }
}

/**
 * 排序弹窗
 */
export const useSortModal = () => {
  const sortList = [
    {
      value: SortEnum.nameAsc,
      label: '按名称升序'
    },
    {
      value: SortEnum.nameDesc,
      label: '按名称倒序'
    },
    {
      value: SortEnum.authorAsc,
      label: '按歌手升序'
    },
    {
      value: SortEnum.authorDesc,
      label: '按歌手倒序'
    },
    {
      value: SortEnum.createAsc,
      label: '按创建时间升序'
    },
    {
      value: SortEnum.createDesc,
      label: '按创建时间倒序'
    }
  ]
  const currentSortValue = ref<SortEnum>(SortEnum.createDesc)

  const onSortChange = (e: RadioGroupOnChangeEvent) => {
    currentSortValue.value = e.detail.value as SortEnum
  }

  return { currentSortValue, sortList, onSortChange }
}

/**
 * 标签
 */
export const useTabs = ({ formState }: USETabsOption) => {
  const tabs = [
    {
      value: TabEnum.song,
      label: '歌曲',
      component: () => h(PaneSong)
    },
    {
      value: TabEnum.singer,
      label: '歌手',
      component: () => h(PaneSinger)
    },
    {
      value: TabEnum.playlist,
      label: '播放列表',
      component: () => h(PanePlaylist)
    }
  ]
  const onClickTab = (index: number) => {
    formState.activeTabIndex = index
  }

  return { tabs, onClickTab }
}
