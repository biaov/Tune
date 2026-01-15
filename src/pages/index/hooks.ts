import type { RadioGroupOnChangeEvent } from '@uni-helper/uni-app-types'

/**
 * 菜单
 */
export const useMenu = () => {
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

  const [sortVisible, setSortVisible] = useState(true)

  const onClickItem = (item: (typeof menu)[0]) => {
    if (item.path) {
      uni.navigateTo({ url: item.path })
      return
    }

    switch (item.key) {
      case 'sort':
        setSortVisible(true)
        break
    }
  }

  return { menu, onClickItem, sortVisible }
}

/**
 * 排序弹窗
 */
export const useSortModal = () => {
  const sortList = [
    {
      value: 'name-asc',
      label: '按名称升序'
    },
    {
      value: 'name-desc',
      label: '按名称倒序'
    },
    {
      value: 'author-asc',
      label: '按作者升序'
    },
    {
      value: 'author-desc',
      label: '按作者倒序'
    },
    {
      value: 'create-asc',
      label: '按创建时间升序'
    },
    {
      value: 'create-desc',
      label: '按创建时间倒序'
    }
  ]
  const defaultSortValue = sortList.at(-1)!.value
  const currentSortValue = ref(defaultSortValue)

  const onSortChange = (e: RadioGroupOnChangeEvent) => {
    currentSortValue.value = e.detail.value
  }

  return { currentSortValue, defaultSortValue, sortList, onSortChange }
}
