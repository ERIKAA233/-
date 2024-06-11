<template>
  <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <!-- row是已有菜单对象 -->
      <template #="{ row, $index }">
        <el-button type="primary" @click="addPermission(row)" size="small" :disabled="row.level == 4 ? true : false">{{
          row.level == 3 ? '添加功能' :
            '添加菜单' }}</el-button>
        <el-button type="primary" @click="updatePermission(row)" size="small"
          :disabled="row.level == 1 ? true : false">编辑</el-button>
        <el-popconfirm :title="`您确定要删除${row.name}吗？`" width="260px" @confirm="removeMenu(row.id)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>


  </el-table>
  <!-- 对话框组件 用于添加更新数据结构 -->
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" width="500">
    <!-- 表单组件 -->
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请您输入菜单名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请您输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqRemove, reqAddOrUpdate, reqAllPermission } from '@/api/acl/menu';
import type { MenuParams, PermissionResponseData, PermissionList, Permission } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
//存储菜单的数组
let PermissionArr = ref<PermissionList>([])
let dialogVisible = ref<boolean>(false)
let menuData = reactive<MenuParams>({
  "code": '',
  "level": 0,
  "name": '',
  "pid": 0,
})
onMounted(() => {
  //获取菜单数据
  getHasPermission()
})
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}
const addPermission = (row: Permission) => {
  //清空数据
  Object.assign(menuData, {
    "code": '',
    "level": 0,
    "name": '',
    "pid": 0,
  })
  //对话框显示
  dialogVisible.value = true
  //收集level
  menuData.level = row.level + 1
  //新增子菜单
  menuData.pid = row.id as number
}
const updatePermission = (row: Permission) => {
  //收集需要修改的那个菜单的数据
  Object.assign(menuData, row)
  dialogVisible.value = true
}
//确定按钮
const save = async () => {
  //发请求
  let result = await reqAddOrUpdate(menuData)
  console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '成功!'
    })
    dialogVisible.value = false
    getHasPermission()
  }
}
const removeMenu = async (id: number) => {
  let result: any = await reqRemove(id)
  if(result.code==200){
    ElMessage({type:'success',message:'删除成功'})
    getHasPermission()
  }
}
</script>
<style scoped></style>
