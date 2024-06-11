//通过vue-router实现模板路由配置
import { createRouter, createWebHashHistory,RouteRecordRaw } from 'vue-router'
import { constantRoute } from './routes';

let router = createRouter({
  history: createWebHashHistory(),
  routes: (constantRoute as RouteRecordRaw[]),
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }

})
export default router;