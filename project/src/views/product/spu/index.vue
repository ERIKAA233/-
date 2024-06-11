<template>
  <div class="">
    <!-- 三级分类 -->
    <Category :scene="scene" />
    <el-card style="margin:10px 0px;">
      <!-- v-if与v-show都可以实现显示与隐藏 -->
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" size="default" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
        <el-table style="margin:10px 0px;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="120px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <!-- row是spu对象 -->
              <el-button type="primary" size="small" icon="Plus" @click="addSku(row)" title="添加SKU"></el-button>
              <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="small" icon="Search" title="查看SPU列表" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.spuName}吗?`" @confirm="deleteSpu(row)" width="200px">
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>


            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!-- 添加SPU/修改SPU -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加SKU -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene" />
      <!-- dialog对话框 展示sku列表 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #='{ row, $index }'>
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type';
import { ref, watch,onBeforeMount } from 'vue';
import { reqRemoveSpu, reqHasSpu, reqSkuList } from '@/api/product/spu';
//引入分类仓库
import useCategoryStore from '@/store/modules/category';
//引入子组件
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore();
//场景数值
let scene = ref<number>(0)//0显示已有SPU/1添加修改SPU/添加SKU
//分页器默认页码
let pageNo = ref<number>(1)
//每一页几条数据
let pageSize = ref<number>(3)
//存储已有spu数据
let records = ref<Records>([])
//存储已有spu总个数
let total = ref<number>(0);
//获取子组件SpuForm
let spu = ref<any>();
let sku = ref<any>();
//存储sku
let skuArr = ref<SkuData[]>([])
//控制dialog显示隐藏
let show = ref<boolean>(false)

//监听三级分类id
watch(() => categoryStore.c3Id, () => {
  //务必保证有三级分类id
  if (!categoryStore.c3Id) return;
  getHasSpu();

});
//路由组件销毁前清空数据
onBeforeMount(()=>{
  categoryStore.$reset();
})

//此方法执行可以获取某一个三级分类下全部的已有spu
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }
}
//分页器下拉菜单发生变化
const changeSize = () => {
  getHasSpu();
}
const addSpu = () => {
  scene.value = 1;
  spu.value.initAddSpu(categoryStore.c3Id);
}
//修改已有spu按钮回调
const updateSpu = (row: SpuData) => {
  scene.value = 1;
  // 调用子组件实例方法获取SPU
  spu.value.initHasSpuData(row)

}
//删除spu
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu((row.id as number))
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
    getHasSpu(records.value.length>1?pageNo.value:pageNo.value-1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败!'
    })
  }
  console.log(result)

}
//子组件spuform绑定的自定义事件 场景切换为0
const changeScene = (obj: any) => {
  //子组件点击取消切换场景
  scene.value = obj.flag;
  if (obj.params == 'update') {
    //更新
    getHasSpu(pageNo.value)
  } else {
    //再次获取已有spu
    getHasSpu()
  }
}
const addSku = (row: SpuData) => {
  //切换场景
  scene.value = 2;
  console.log(row)
  //调用子组件初始化SKU数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList((row.id as number))
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}


</script>
<style scoped></style>
