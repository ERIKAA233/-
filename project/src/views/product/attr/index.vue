<template>
  <div>
    <Category :scene="scene" />
    <el-card style='margin:10px 0px;'>
      <div v-show="scene == 0">
        <el-button type='primary' size='default' icon='Plus' :disabled='categoryStore.c3Id ? false : true'
          @click="addAttr">添加属性</el-button>
        <el-table border style='margin:10px 0px;' :data='attrArr'>
          <el-table-column label='序号' type='index' align='center' width='80px'></el-table-column>
          <el-table-column label='属性名称' width='120px' prop="attrName"></el-table-column>
          <el-table-column label='属性值名称'>
            <template #="{ row }">
              <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label='属性值操作' width='120px'>
            <template #="{ row , $index}">
              <!-- 修改已有属性 -->
              <el-button type="primary" size="small" icon="Edit" color="#FFFF66" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`您确定要删除${row.attrName}吗?`" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" color="#6699FF"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label='属性名称'>
            <el-input v-model="attrParams.attrName" placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
          icon="Plus">添加属性值</el-button>
        <el-button type="primary" @click="cancel">取消添加</el-button>
        <el-table border style="margin:10px 0px;" :data="attrParams.attrValueList">
          <el-table-column label="序号" type="index" width="80px"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- row是当前属性值对象 -->
              <el-input size="small" v-if="row.flag" @blur="toLook(row, $index)"
                :ref="(vc: any) => inputArr[$index]=vc " placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Delete" color="#6699FF"
                @click="attrParams.attrValueList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save"
          :diabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>


</template>
<script setup lang="ts">
//引入组合式API函数watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
//引入获取已有属性值的属性方法
import { reqAttr, reqAddOrUpdateAttr,reqRemoveAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
//卡片组件场景转换
let scene = ref<number>(0);//scene=0:table scene=1:属性
//收集新增数据
let attrParams = reactive<Attr>({
  attrName: '',//新增属性名
  attrValueList: [],//新增属性值数组
  categoryId: '',//三级分类的ID
  categoryLevel: 3,//代表三级分类
})
//准备一个数组  将来存储对应的组件实例el-input
let inputArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
  //清空上一次查询的属性与属性值
  attrArr.value = [];
  //保证三级分类得有才能发请求
  if (!categoryStore.c3Id) return;
  //获取分类的ID
  getAttr();
})
//路由组件销毁时把仓库分类相关数据清空
onBeforeUnmount(()=>{
  //清空仓库数据
  categoryStore.$reset();
  
})
//获取已有的属性和属性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
}
//添加属性
const addAttr = () => {
  //每一次点击前先清空数据
  Object.assign(attrParams, {
    attrName: '',//新增属性名
    attrValueList: [],//新增属性值数组
    categoryId: '',//三级分类的ID
    categoryLevel: 3,//代表三级分类
  })
  scene.value = 1
  //点击按钮 新增属性三级分类id
  attrParams.categoryId = categoryStore.c3Id
}
//修改属性
const updateAttr = (row:Attr) => {
  scene.value = 1
  //将已有属性对象赋值给attrparams
  //Object.assign对象合并:浅拷贝 两份指向同一个地址 有坑

  Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
//删除某一个已有属性
const deleteAttr=async(attrId:number)=>{
  let result:any=await reqRemoveAttr(attrId)
  //删除成功
  if(result.code==200){
    ElMessage({
      type:'success',
      message:'删除成功!'
    })
    getAttr()
  }else{
    ElMessage({
      type:'error',
      message:'删除失败!'
    })
  }
}
//取消
const cancel = () => {
  scene.value = 0
}

//添加属性值
const addAttrValue = () => {
  //点击添加属性值按钮 向数组添加属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })
}
//保存属性值 
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    //获取全部已有属性和属性值
    getAttr();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'

    })
  }
}
//属性值表单元素失去焦点
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断:不能为空
  if (row.valueName.trim() == "") {
    attrParams.attrValueList.splice($index)
    ElMessage({
      type: 'error',
      message: '属性值不能为空!'
    })
    return
  }
  //非法情况判断：属性值不能相同
  let repeat = attrParams.attrValueList.find((item) => {
    //失去焦点属性值对象从当前数组扣除去判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //去重
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复!'
    })
    return
  }
  row.flag = false;
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true;
  // nextTick响应式数据发生变化 获取更新的dom
  nextTick(()=>{
    inputArr.value[$index].focus();
  })
}

</script>
<style scoped></style>
