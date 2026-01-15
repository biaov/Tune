import type { SortEnum, TabEnum } from './enums'

export interface FormStateType {
  sort: SortEnum
  activeTabIndex: number
}

interface FormOption {
  formState: Reactive<FormStateType>
}

export interface USEMenuOption extends FormOption {
  currentSortValue: Ref<string>
}

export interface USETabsOption extends FormOption {}
