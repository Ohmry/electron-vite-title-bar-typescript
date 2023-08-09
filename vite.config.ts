import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

const __dirname: string = path.resolve()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
        path.resolve(__dirname, 'src/electron-vite-title-bar-loader.ts'),
        path.resolve(__dirname, 'src/electron-vite-title-bar-preloader.ts')
      ],
      name: 'ElectronViteTitleBar',
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'electron'],
      input: {
        'components': 'src/index.ts',
        'loader': 'src/electron-vite-title-bar-loader.ts',
        'preloader': 'src/electron-vite-title-bar-preloader.ts'
      },
      output: {
        globals: {
          vue: 'Vue',
          electron: 'electron'
        }
      }
    }
  }
})
