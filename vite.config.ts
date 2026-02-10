import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    autoImport({
      imports: [
        'vue',
        {
          dayjs: [['default', 'dayjs']]
        },
        {
          '@dcloudio/uni-app': ['onLaunch', 'onShow', 'onHide', 'onLoad', 'onReady', 'onUnload', 'onReachBottom', 'onPullDownRefresh', 'onShareAppMessage', 'onShareTimeline', 'onPageScroll']
        }
      ],
      dirs: ['./src/composables', './src/store', 'src/enums'],
      dts: './types/auto-imports.d.ts'
    }),
    components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [/node_modules/, 'types.ts'],
      dts: './types/components.d.ts'
    }),
    uni()
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  build: {
    target: 'es2020'
  }
})
