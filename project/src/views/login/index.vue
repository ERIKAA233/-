<template>
  <div class="login_container">
    <el-row>
      <el-col :span='12' :xs="0"></el-col>
      <el-col :span='12' :xs="24">
        <el-form class='login_form' :model='loginForm' :rules='rules' ref='loginForms'>
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon='User' v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon='Lock' type='password' v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading='loading' class="login_btn" type="primary" size='default' @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
//引入用户相关小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: '111111', })
//获取el-form组件
let loginForms = ref()
//获取路由器
let $router = useRouter()
let $route = useRoute()
//定义变量控制按钮加载
let loading = ref(false)
//登录按钮回调
const login = async () => {
  //保证全部表单项校验通过后再发请求
  await loginForms.value.validate()
  //点击登录按钮后通知仓库发请求，如果成功则跳转到首页，请求失败弹出登陆失败信息
  try {
    loading.value = true
    //保证登陆成功
    await userStore.userLogin(loginForm);
    //编程式导航跳转到展示首页
    //判断登录的时候路由路径中是否有query参数 如果有就跳转至query 没有就首页
    let redirect:any =$route.query.redirect
    $router.push({path:redirect||'/'});
    //登陆成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`
    })
    //登陆成功加载效果也消失
    loading.value = false
  } catch (error) {
    //登陆失败提示信息
    loading.value = false
    ElNotification({
      //登陆失败加载消失
      type: 'error',
      message: (error as Error).message
    })
  }
}
//自定义校验规则需要的函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule是校验规则对象
  //value是表单元素文本内容
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  //rule是校验规则对象
  //value是表单元素文本内容
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}


//定义表单校验需要的配置对象
const rules = {
  username: [
    //required:必填
    //min max 文本至少 最多多少位
    //message 文本的错误信息
    //trigger 触发时机 change文本发生变化校验 blur 失去焦点
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // { required: true, min: 6, max: 10, message: '账号长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    // { required: true, min: 6, max: 16, message: '密码长度至少6位', trigger: 'change' },
    { trigger: 'change', validator: validatorPassword }
  ]
  ,
}




</script>
<style scoped lang='scss'>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png') no-repeat;
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }

  .login_btn {
    width: 100%;
  }
}
</style>
