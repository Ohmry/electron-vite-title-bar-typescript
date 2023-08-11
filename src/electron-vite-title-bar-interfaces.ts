interface MenuInfo {
  id?: string
  label?: string
  hotKey?: string
  subMenu?: Array<MenuInfo>
  separator?: Boolean,
  disabled?: Boolean
}

interface MenuValidation {
  success: Boolean,
  error?: string
}

interface CollapseMenuInfo {
  label?: string
  subMenu: Array<MenuInfo>
}

interface EvtbWindowApi {
  isMaximized: Function,
  maximize: Function,
  minimize: Function,
  restore: Function,
  close: Function,
  menu?: any
}