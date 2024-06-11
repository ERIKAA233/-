//小仓库 关于layout组件配置
import { defineStore } from 'pinia';
let useLayOutSettingStore=defineStore('SettingStore',{
  state:()=>{
    return {
      fold:false,//用于控制菜单折叠还是收起
      refresh:false,//用于控制刷新效果
    }
  }
})
export default useLayOutSettingStore;