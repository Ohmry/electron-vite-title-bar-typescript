// @ts-ignore
import { contextBridge, ipcRenderer } from 'electron'
import './electron-vite-title-bar-interfaces'

class ElectronViteTitleBarPreloader {
  initialize (): void {
    const evtbWindowApi: EvtbWindowApi = {
      isMaximized: () => ipcRenderer.invoke('evtb:isMaximized'),
      maximize: () => ipcRenderer.invoke('evtb:maximize'),
      minimize: () => ipcRenderer.invoke('evtb:minimize'),
      restore: () => ipcRenderer.invoke('evtb:restore'),
      close: () => ipcRenderer.invoke('evtb:close')
    }

    // @ts-ignore
    if (process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld('evtb', evtbWindowApi)
      } catch (error) {
        console.error(error)
      }
    } else {
      // @ts-ignore
      window.evtb = evtbWindowApi
    }
  }
}

export default ElectronViteTitleBarPreloader