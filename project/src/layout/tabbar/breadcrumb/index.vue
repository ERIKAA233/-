<template>
  <div class="tabbar_left">
    <!-- 左侧静态 -->
    <el-icon style="margin-right:10px" @click="changeIcon">
      <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>

    </el-icon>
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <!-- 面包屑动态展示路由名与标题 -->
      <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
        <el-icon style='margin:0 2px;'>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 面包屑展示路由标题 -->
        <span>{{ item.meta.title }}</span>
      </el-breadcrumb-item>

    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
//引入响应式控制图标切换

import { useRoute } from 'vue-router'
//用于控制菜单折叠还是打开
import useLayOutSettingStore from '@/store/modules/setting';
let $route = useRoute()
let LayOutSettingStore = useLayOutSettingStore();
const changeIcon = () => {
  //图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold;
}

</script>
<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>
<style scoped></style>
