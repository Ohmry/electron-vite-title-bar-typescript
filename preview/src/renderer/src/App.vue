<template>
  <ElectronViteTitleBar
    :menu="menu"
    @onMenuClick="(e) => console.log(e)"
  ></ElectronViteTitleBar>
</template>
<script setup lang="ts">
import ElectronViteTitleBar from '../../../../src/ElectronViteTitleBar.vue'
import '../../../../src/electron-vite-title-bar-style.css'

const menu: Array<MenuInfo> = [
  {
    label: 'File',
    subMenu: [
      { label: 'New', hotKey: 'Ctrl+N' },
      { label: 'Open', hotKey: 'Ctrl+O' },
      { label: 'Open Recent' }
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
</script>
<style></style>