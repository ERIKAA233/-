<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Logo />
      <!-- 展示菜单 -->
      <el-scrollbar class="scrollbar">
        <!-- 滚动组件 -->
        <el-menu :collapse="LayOutSettingStore.fold?true:false" :default-active="$route.path" background-color="$base-menu-background"
          text-color='white' active-text-color="yellowgreen">
          <!-- 添加default-active刷新后仍然激活选中的路由 -->
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList='userStore.menuRoutes' />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Tabbar />
    </div>
    <!-- 内容展示 -->
    <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <Main />
    </div>

  </div>
</template>
<script setup lang="ts">
import{useRoute} from 'vue-router'
//右侧内容展示区
import Main from './main/index.vue'
//引入logo组件
import Logo from './logo/index.vue'
//引入设置标题logo文件
import Tabbar from './tabbar/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting'
let userStore = useUserStore()
let $route =useRoute()
let LayOutSettingStore = useLayOutSettingStore()
console.log($route.path)
</script>

<script lang="ts">
export default {
  name:'Layout'
}
</script>
<style scoped lang='scss'>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition:all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu{
        border-right:none;
      }
    }
    &.fold{
      width:$base-menu-min-width;
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    color:black;
    top: 0px;
    left: $base-menu-width;
    transition:all 0.3s;
    &.fold{
      width:calc(100vw - $base-menu-min-width);
      left:$base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    top: $base-tabbar-height;
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
      &.fold {
        width: calc(100vw - $base-menu-min-width);
        left: $base-menu-min-width;
      }
  }
}
</style>
