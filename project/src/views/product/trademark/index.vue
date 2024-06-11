<template>
  <div>
    <el-card class='box-card'>
      <el-button type='primary' icon='Plus' @click='addTrademark' v-has="`btn.Trademark.add`">添加品牌</el-button>
      <!-- 表格组件用于展示已有品牌 -->
      <!-- table：border设置表格纵向是否有边框
         table-column:label:某个列表 width:宽度 align:文字对齐 -->
      <el-table style='margin:10px 0px;' border :data='trademarkArr'>
        <el-table-column label='序号' width='80px' align="center" type='index'></el-table-column>
        <el-table-column label='品牌名称'>
          <template #='{ row, $index }'>
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label='品牌LOGO'>
          <template #='{ row, $index }'>
            <img :src='row.logoUrl' alt='图片资源不存在!' style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column label='品牌操作'>
          <template #='{ row, $index }'>
            <el-button type="primary" size='small' icon='Edit' @click="updateTrademark(row)"></el-button>
            <el-popconfirm title="您确定要删除吗?" width='250px' icon='delete' @confirm='removeTradeMark(row.id)'>
              <template #reference>
                <el-button type="primary" size='small' icon='Delete'></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <!-- pagination: v-model:current-page:设置分页器当前页码 page-size:设置每页展示数据的条数 
        page-sizes用于设置下拉菜单数据 layout:设置分页器子组件布局调整-->

      <el-pagination @size-change='sizeChange()' @current-change='getHasTrademark()' v-model:current-page="pageNo"
        v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
    </el-card>
    <!-- 对话框组件：添加修改时使用的 -->
    <!-- v-model控制对话框显示隐藏 true显示 false隐藏 title 设置对话框左上角标题 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
      <el-form style="width:80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width='80px' prop='tmName'>
          <el-input placeholder='请您输入品牌名称' v-model='trademarkParams.tmName'></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width='80px' prop='logoUrl'>
          <!-- upload action:请求url携带api before-upload:约束上传文件格式大小   -->
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 footer -->
      <template #footer>
        <el-button type="primary" size="default" @click='confirm'>确定</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
// 引入组合式API函数ref
import { ref, onMounted, reactive, nextTick } from 'vue'
//引入请求函数
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus';
import useUserStore from '@/store/modules/user'
let userStore = useUserStore();
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌数据总量
let total = ref<number>(0)
//存储已有品牌的数组
let trademarkArr = ref(<Records>[])
let dialogFormVisible = ref<boolean>(false)
//引入TS类型
import type { UploadProps } from 'element-plus'
//定义新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
//获取el-form组件实例
let formRef = ref();
//获取已有品牌的接口封装为一个函数 在任何情况下获取数据时调用即可
const getHasTrademark = async (pager = 1) => {
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    //已有品牌个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//添加
const addTrademark = () => {
  dialogFormVisible.value = true
  //初始化数据
  trademarkParams.id = undefined
  trademarkParams.tmName = '',
    trademarkParams.logoUrl = ''
  //去除报错
  //ts问号语法
  //formRef.value?.clearValidate('tmName')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//编辑
const updateTrademark = (row: TradeMark) => {
  //row是当前已有的品牌
  dialogFormVisible.value = true
  //把已有的品牌数据赋值到trademarkParams上
  //ES6语法合并对象
  Object.assign(trademarkParams, row)
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//对于当前页码发生变化的自定义事件 组件pagination父组件回传了数据：回传的是页码
//下拉菜单发生变化时触发的方法
const sizeChange = () => {
  //数据量发生变化页码归1
  pageNo.value = 1;
  //返回的是下拉菜单选中的数据
  getHasTrademark()
}
//对话框底部取消
const cancel = () => {
  dialogFormVisible.value = false
}
//对话框底部确定
const confirm = async () => {
  //在你发请求之前要对整个表单进行校验
  await formRef.value.validate()//保证校验成功后才进行
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    //添加品牌成功
    //关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功!' : '添加品牌成功'
    })
    //再次发请求 获取已有品牌全部数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    //添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败!' : '添加品牌失败'
    })
  }
}
//图片上传前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子在图片上传成功前触发 上传文件之前可以约束文件大小
  //要求上传文件格式:png|jpg|gif
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小应小于4M!'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式应为PNG,JPG,GIF格式!'
    })
    return false;
  }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile: any) => {
  trademarkParams.logoUrl = response.data
  //上传成功 清除图片校验的报错
  formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    //校验未通过返回错误信息
    callBack(new Error('品牌名称位数应大于等于两位'))
  }
}
//品牌图片校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    //如果图片上传
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }

}
//表单校验规则对象
const rules = {
  tmName: [
    //此字段必须要校验 表单项出现五角星
    //trigger:触发校验时机[blur,change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}
//气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  //点击确定删除品牌
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功!',
      //再次获取已有品牌信息
    })
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败!'
    })

  }
}

onMounted(() => {
  getHasTrademark()
})



</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>