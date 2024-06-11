//用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type';

//引入数据类型
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入常量路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'


//用于过滤异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        //硅谷333账号:product\trademark\attr\sku
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
let useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),//用户唯一标识token
      //@ts-ignore
      menuRoutes: constantRoute,//仓库存储菜单生成需要数组
      username: '',
      avatar: '',
      //存储当前用户是否包含某个按钮
      buttons: [],
    }
  },
  //异步|逻辑的地方
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      // console.log(result)
      //登录请求：成功 得到token
      //登录请求：失败 登陆失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储token
        this.token = (result.data as string);
        //本地存储
        SET_TOKEN((result.data) as string)
        //保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息的方法
    async userInfo() {
      //获取用户信息进行存储
      let result: userInfoResponseData = await reqUserInfo()
      // console.log(result);
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
        //菜单的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
        [...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route);
        })
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    async userLogout() {
      let result: any = await reqLogout();
      // console.log(result)
      if (result.code == 200) {
        this.token = '',
          this.username = '',
          this.avatar = '',
          REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }

    }
  },
  //计算属性
  getters: {

  }
})
//对外暴露获取小仓库方法
export default useUserStore