<template>
  <ElectronViteTitleBar
    ref="titlebar"
    :menu="menu"
    @on-menu-click="onMenuClick"
  ></ElectronViteTitleBar>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ElectronViteTitleBar from '../../../../src/ElectronViteTitleBar.vue'
import ElectronViteTitleBarMenu from '../../../../src/electron-vite-title-bar-menu'
import '../../../../src/electron-vite-title-bar-style.css'

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