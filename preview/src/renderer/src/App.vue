<template>
  <ElectronViteTitleBar
    icon="src/assets/icon.svg"
    title="Scheduler"
    ref="titlebar"
    :menu="menu2"
    @on-menu-click="onMenuClick"
  ></ElectronViteTitleBar>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElectronViteTitleBar, ElectronViteTitleBarMenu } from '../../../../src/index.ts'
import '../../../../src/electron-vite-title-bar-style.css'
import menu2 from '../resources/menu'

const titlebar = ref()
const menu: Array<MenuInfo> = [
  {
    label: 'File',
    subMenu: [
      { label: 'New', hotKey: 'Ctrl+N' },
      { label: 'Open', hotKey: 'Ctrl+O' },
      { label: 'Open Recent', disabled: true }
    ]
  },
  {
    label: 'Edit',
    subMenu: [
      { label: 'Undo' },
      { label: 'Redo' },
      { separator: true },
      { label: 'Cut', hotKey: 'Ctrl+X' },
      { label: 'Copy', hotKey: 'Ctrl+C' },
      { label: 'Paste', hotKey: 'Ctrl+V' }
    ]
  },
  {
    label: 'View',
    subMenu: [
      { label: 'Split View', hotKey: 'Ctrl+Shift+V' }
    ]
  },
  {
    label: 'Select',
    subMenu: [
      { label: 'Select Line' },
      { label: 'Select All' }
    ]
  },
  {
    label: 'Help',
    subMenu: [
      { label: 'View License' },
      { label: 'Report Issue' },
      { separator: true },
      { label: 'About' }
    ]
  }
]

const onMenuClick = (id: string, label: string): void => {
  console.log(id, label)
}

onMounted(() => {
  const instance = ElectronViteTitleBarMenu.getInstance()
  instance.setMenuDisabled('evtb-menu-item-1-1', true)
})
</script>
<style></style>