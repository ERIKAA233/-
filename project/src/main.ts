import { createApp } from 'vue'

import App from './App.vue'
//安装插件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import.meta.env
//svg文件所需配置代码
import 'virtual:svg-icons-register'
//注册全局svg
// import SvgIcon from '@/components/SvgIcon/index.vue'
//引入自定义插件对象：注册整个项目全局组件
import globalComponent from'@/components/index.ts'
import '@/styles/index.scss'
//注册路由
import router from './router'
//引入仓库
import pinia from './store'
//暗黑模式所需样式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app=createApp(App)
//将应用挂载到挂载点上
// app.component('SvgIcon',SvgIcon)
app.use(globalComponent)
app.use(router)
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn
})
//引用路由鉴权文件
import './permission'
//引入自定义指令
import {isHasButton} from '@/directive/has'
isHasButton(app)
app.mount('#app')

