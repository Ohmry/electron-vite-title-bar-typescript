# Electrion Vite Title Bar for Typescript
You can use this component for window title bar instead of native window title bar in frameless electron-vite application for typescript.

## Quick Start
### Installation
Install this package by npm or yarn.
```bash
# NPM
npm install @ohmry/electron-vite-title-bar-typescript

# Yarn
yarn add @ohmry/electron-vite-title-bar-typescript
```

### Import and initialize
Import and initialize in `main/index.ts` and `preload/index.ts`.
#### main/index.ts
```typescript
import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// Import class and create instance
import ElectronViteTitleBarLoader from '@ohmry/electron-vite-title-bar-typescript/loader'
const electronViteTitleBarLoader = new ElectronViteTitleBarLoader()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Initialize
  electronViteTitleBarLoader.initialize(mainWindow)
...
```

#### preload/index.ts
```typescript
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Import and initialize
import ElectronViteTitleBarPreloader from '@ohmry/electron-vite-title-bar-typescript/preloader'
const electronViteTiteBarPreloader = new ElectronViteTitleBarPreloader()
electronViteTiteBarPreloader.initialize()

...
```

### Using component
After intialize, you can use component in App.vue like this.
#### App.vue
```Vue
<template>
  <ElectronViteTitleBar
    :menu="menu"
    title="Electron Vite Title Bar"
    icon="src/images/icon.png"
    @onMenuClick="(e) => console.log(e)">
  </ElectronViteTitleBar>
</template>
<script setup lang="ts">
import { ElectronViteTitleBar } from '@ohmry/electron-vite-title-bar-typescript'
import '@ohmry/electron-vite-title-bar-typescript/dist/style.css'

const menu = [
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
      { separator: true},
      { label: 'About' }
    ]
  }
]
</script>
```

### Documents
you can see another information of it as below documents.
  - [Managing for menu](./docs/managing-for-menu.md)
  - [Customize color](./docs/customize-color.md)