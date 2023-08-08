// @ts-ignore
import { ipcMain, BrowserWindow } from 'electron'

class ElectronVueTitleBarLoader {
  initialize (mainWindow: BrowserWindow): void {
    ipcMain.handle('evtb:isMaximized', (): Boolean => { return mainWindow.isMaximized() })
    ipcMain.handle('evtb:maximize', (): void => { mainWindow.maximize() })
    ipcMain.handle('evtb:minimize', (): void => { mainWindow.minimize() })
    ipcMain.handle('evtb:restore', (): void => { mainWindow.restore() })
    ipcMain.handle('evtb:close', (): void => { mainWindow.close() })
  }
}

export default ElectronVueTitleBarLoader