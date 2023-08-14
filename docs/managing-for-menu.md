# Managing for menu
After creating menu in ElectronViteTitleBar, you can handle menu dynamically in .vue file like this.

## Getting instance of menu
First, you get instance of ElectronViteTitleBarMenu as below code.
you must be get instance after onMouted because ElectronViteTitleBar components completely initialized after onMounted cyle.
```Vue
// Vue3 & Composition API
<template>
  <ElectronViteTitleBar :menu="menu"></ElectronViteTitleBar>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { ElectronViteTitleBar, ElectronViteTitleBarMenu } from '@ohmry/electron-vite-title-bar-typescript'
const menu = [
  {
    label: 'File',
    subMenu: [
      { label: 'New', hotKey: 'Ctrl+N' }
      { separator: true}
      { label: 'Open', hotKey: 'Ctrl+O' }
    ]
  }
]
onMounted(() => {
  const electronViteTitleBarMenu = ElectronViteTitleBarMenu.getInstace()
})
</script>
```

### Methods
You can use these method by intance of ElectronViteTitleBarMenu.

#### getMenuList () → Array<MenuInfo>
get list of menu that be created in ElectronViteTitleBar

#### getMenuInfo (id: string) → MenuInfo
get information for menu item by id

#### setMenuDisabled (id: string, disabled: Boolean) → void
set disabled for menu item

#### getMenuDisabled (id: string) → disabled: Boolean
get disabled of menu item