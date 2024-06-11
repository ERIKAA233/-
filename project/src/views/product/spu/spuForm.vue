<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option :label="item.tmName" v-for="(item, index) in AllTradeMark" :key="item.id"
          :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入SPU描述" v-model="SpuParams.description"> </el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:filelist展示默认图片 action是上传图片接口地址 -->

      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height:100%;" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性下拉菜单 -->
      <span>
        <el-select v-model="saleAttrIdAndValueName"
          :placeholder="unSelectSaleAttr.length ? `还有${unSelectSaleAttr.length}个未选择` : `尚无待选择属性`">
          <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :key="item.id"
            :label="item.name"></el-option>
        </el-select>
      </span>
      <el-button @click="addsaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left:10px"
        type="primary" size="default" icon="Plus">添加属性值</el-button>
      <el-table border style="margin:10px 0px;" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center"></el-table-column>
        <el-table-column label="销售属性名" width="100px" prop="saleAttrName"> </el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <!-- row是当前spu已有的属性对象 -->
            <el-tag style="width:auto;margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
              v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-if="row.flag == true" style="width:100px;margin-right:10px;" @blur="toLook(row)"
              v-model="row.saleAttrValue" size="small" placeholder="请你输入属性值"></el-input>
            <el-button @click="toEdit(row)" v-else type="primary" size="small" icon="Plus"></el-button>
          </template>

        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
          </template>
        </el-table-column>


      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default"
        @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpuData } from '@/api/product/spu/type'
import { reqAddOrUpdateSpu, reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr } from '@/api/product/spu';
import type { SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
let $emit = defineEmits(['changeScene']);
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

//给子组件书写方法
//存储数据
let AllTradeMark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//销售属性
let saleAttr = ref<SaleAttr[]>([])
//控制对话框的显示隐藏
let dialogVisible = ref<boolean>(false)
//全部的销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储已有图片的地址
let dialogImageUrl = ref<string>('')
//存储已有spu对象
let SpuParams = ref<SpuData>({
  category3Id: "",
  description: "",
  spuName: "",
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
//收集还未选择的销售属性和属性值
let saleAttrIdAndValueName = ref<string>('')
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})


//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象 将来在模板中展示
  SpuParams.value = spu;
  //spu是父组件传递过来的spu对象（不完整）
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark();
  //获取商品图片
  let result1: SpuHasImg = await reqSpuImageList((spu.id as number))
  //获取spu销售属性数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储品牌数据
  AllTradeMark.value = result.data;
  imgList.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data
}
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}
//照片墙删除文件钩子
const handleRemove = () => {

}
//照片墙删除成功前的钩子：
const handlerUpload = (file: any) => {
  //约束类型
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件过大,请重新选择!'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式错误!'
    })
    return false;
  }
}
//添加销售属性的方法
const addsaleAttr = () => {
  // baseSaleAttrId: number;
  // saleAttrName: string;
  // spuSaleAttrValueList: spuSaleAttrValueList
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象将来带给服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //清空收集的数据
  saleAttrIdAndValueName.value = ''
}
//属性值的编辑模式
const toEdit = (row: SaleAttr) => {
  //使flag为真
  row.flag = true;
  row.saleAttrValue = ''
}
//表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  //整理收集属性ID和属性名
  const { baseSaleAttrId, saleAttrValue } = row;
  //整理属性形式 push
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: (saleAttrValue as string),
  }
  //非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值错误!'
    })
    return
  }
  //判断属性是否重复
  let repeat = row.spuSaleAttrValueList.find(item => {
    return item.saleAttrValueName == saleAttrValue;
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复!'
    })
    return;
  }

  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换模式
  row.flag = false;
}
//保存按钮回调
const save = async () => {
  //整理参数，发请求：更新/添加spu
  //照片墙
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  //销售属性
  SpuParams.value.spuSaleAttrList = saleAttr.value;
  let result: any = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    //通知父级组件切换事件为0
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败'
    })
  }
}
//添加新的spu
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: "",
    description: "",
    spuName: "",
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //清空照片墙
  imgList.value = [];
  saleAttr.value = [];
  saleAttrIdAndValueName.value = '';
  //存储三级分类id
  SpuParams.value.category3Id = c3Id;
  //获取品牌数据
  let result: AllTradeMark = await reqAllTradeMark();
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
  //存储
  AllTradeMark.value = result.data;
  allSaleAttr.value = result1.data;
}

//对外暴露
defineExpose({ initHasSpuData, initAddSpu });
</script>
<style scoped>
span {
  display: inline-block;
  width: 150px;
}
</style>