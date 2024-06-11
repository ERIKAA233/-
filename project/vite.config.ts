import { defineConfig, loadEnv } from 'vite'
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig(({ command,mode }) => {
  //获取各个环境下的对应变量
  let env=loadEnv(mode,process.cwd())//环境对象
  return {
    plugins: [vue(), createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }), viteMockServe({
      localEnabled: command === 'serve',
    }),],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //配置代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})