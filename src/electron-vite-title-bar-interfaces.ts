interface MenuInfo {
  label?: string
  hotKey?: string
  subMenu?: Array<MenuInfo>
  separator?: Boolean
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
  close: Function
}