<template>
  <div class="tabbar_right">
    <el-button size="small" icon='Refresh' circle @click="updateRefresh"></el-button>
    <el-button size="small" icon='FullScreen' circle @click='fullScreen'></el-button>
    <el-popover placement="bottom" title="主题设置" :width="200">
      <!-- 表单元素 -->
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker @change="setColor" size="small" v-model="color" show-alpha :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch @change="changeDark" v-model="dark" class="mt-2" inline-prompt size="small" active-icon="Moon"
            inactive-icon="Sunny" />
        </el-form-item>
      </el-form>
      <template #reference>
        <el-button size="small" icon='Setting' circle></el-button>
      </template>
    </el-popover>
    <img :src="userStore.avatar" style='width:24px;height:24px;margin:0 10px;border-radius:50%;' alt="">
    <!-- 下拉菜单 -->
    <el-dropdown :hide-on-click="false">
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click='logout'>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
//获取小仓库
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { ref } from 'vue'

let userStore = useUserStore();
let LayOutSettingStore = useLayOutSettingStore();
let $router = useRouter();
let $route = useRoute();
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
//收集开关数据
let dark = ref<boolean>(false)
const fullScreen = () => {
  //dom对象的一个属性 可以用来判断当前是不是全屏模式[全屏:true 不是全屏：false]
  let full = document.fullscreenElement;
  //（有兼容问题）
  //切换为全屏
  if (!full) {
    //利用文档根节点方法实现
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
}
const logout = async () => {
  //向服务器发请求【退出登录接口】 这次的token无效了
  //仓库中关于用户相关的数据清空
  //跳转到登陆页面
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeDark = () => {
  //获取根节点
  let html = document.documentElement
  //判断标签是否有类名dark
  dark.value ? html.className = "dark" : html.className = ''
}
const setColor = () => {
  //通过js修改根节点属性和属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<style scoped></style>
