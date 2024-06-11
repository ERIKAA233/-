<template>
  <el-form label-width='100px'>
    <el-form-item label='SKU名称'>
      <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label='价格/元'>
      <el-input placeholder="请输入价格" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label='重量/g'>
      <el-input placeholder="请输入重量" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label='SKU名称'>
      <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <span>
            <el-select v-model="item.attrIdAndValueId">
              <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
                :key="attrValue.id" :label="attrValue.valueName"></el-option>
            </el-select>
          </span>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <span>
            <el-select v-model="item.saleIdAndValueId">
              <el-option :value="`${item.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"></el-option>
            </el-select>
          </span>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table" style="margin:10px 0px;">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #='{ row, $index }'>
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
//引入请求api
import { ref, reactive, handleError } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqAddSku, reqSpuImageList, reqSpuHasSaleAttr } from '@/api/product/spu';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
//获取table组件实例
let table = ref<any>()
//收集sku参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  //v-model收集
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ''

})
let $emit = defineEmits(['changeScene']);

const save = async() => {
  //保存按钮
  //整理参数发请求
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev;
  }, []);
  //销售属性
  skuParams.skuSaleAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev;
  }, [])
  //发请求
  let result=await reqAddSku(skuParams)
  console.log(result)
  if(result.code==200){
    ElMessage({
      type:'success',
      message:'添加成功!'
    })
    $emit('changeScene',{flag:0,params:''})
  }else{
    ElMessage({
      type:'error',
      message:'添加失败!'
    })
  }
}
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' });
}
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  //收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;
  //获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
  //获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙数据
  let result2: any = await reqSpuImageList(spu.id)

  attrArr.value = result.data;
  saleArr.value = result1.data;
  imgArr.value = result2.data;
}
//设置默认图片
const handler = (row: any) => {
  //排他
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  });
  //复选框选中
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

//对外暴露子组件方法

defineExpose({ initSkuData })
</script>

<style scoped>
span {
  width: 150px;
}
</style>