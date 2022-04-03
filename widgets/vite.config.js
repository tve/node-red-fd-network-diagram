import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'

module.exports = defineConfig({
  plugins: [
    vue(),
    viteExternalsPlugin({
      vue: 'Vue',
      vuetify: 'Vuetify',
      uplot: 'uplot',
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild', // doesn't work !@#$%^&
    lib: {
      entry: resolve(__dirname, 'index.js'),
      formats: ['es'],
      fileName: (format) => `fd-widgets.${format}.js`
    },
    // rollupOptions: {
    //   // vue is provided by FlexDash, for Vuetify use window.Vuetify, for uPlot use window.uPlot
    //   external: ['vue'],
    //   output: { paths: { vue: './vue.esm-browser.prod.js' } },
    // }
  }
})
