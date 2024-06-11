//这里是书写属性相关的api文件
import request from '@/utils/request';
import type { CategoryResponseData,AttrResponseData, Attr } from './type';
enum API{
  //获取一级分类接口地址
  C1_URL ='/admin/product/getCategory1',
  C2_URL ='/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  //获取分类下已有的属性和属性值
  ATTR_URL ='/admin/product/attrInfoList/',
  //添加或修改属性的地址
  ADDORUPDATEATTR_URL ='/admin/product/saveAttrInfo',
  //删除某一个已有的属性
  DELETEATTR_URL ='/admin/product/deleteAttr/'
}
//一级分类接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//二级分类接口
export const reqC2 = (category1Id: number|string) => request.get<any, CategoryResponseData>(API.C2_URL+category1Id);
//三级分类接口
export const reqC3 = (category2Id: number|string) => request.get<any, CategoryResponseData>(API.C3_URL+category2Id);
//获取分类下属性接口
export const reqAttr = (category1Id: number | string, category2Id: number | string, category3Id: number | string) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`)
//新增或修改已有属性接口
export const reqAddOrUpdateAttr=(data:Attr)=>request.post<any,any>(API.ADDORUPDATEATTR_URL,data)
//删除某一个已有属性
export const reqRemoveAttr=(attrId:number)=>request.delete<any,any>(API.DELETEATTR_URL+attrId)