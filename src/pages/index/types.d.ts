import type { SortEnum, TabEnum } from './enums'

export interface USEMenuOption extends FormOption {
  currentSortValue: Ref<string>
}

export interface USETabsOption extends FormOption {}
