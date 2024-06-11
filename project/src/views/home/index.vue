<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好! {{ userStore.username }}</h3>
        <p class="subtitle">卡瓦运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottomImg">
    <img src="/chiikawa.webp" alt="" class="welcome" width="500px" height="500px">

  </div>

</template>
<script setup lang="ts">
//引入用户相关仓库 获取用户头像和昵称
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
//存储用户信息仓库对象
let userStore = useUserStore()
</script>
<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottomImg {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
