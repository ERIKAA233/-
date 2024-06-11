//分类相关数据的ts类型
export interface ResponseData{
  code:number;
  message:string;
  ok:boolean;
}//分类ts类型
export interface CategoryObj{
  id:number|string,
  name:string,
  category1Id?:number,
  category2Id?:number,
}
//相应的分类接口返回数据类型
export interface CategoryResponseData extends ResponseData{
  data:CategoryObj[]
}
//属性值ts类型
export interface AttrValue{
  id?:number;
  valueName:string;
  attrId?:number;
  flag?:boolean;//控制每个属性值编辑模式和查看模式的切换
}
export type AttrValueList=AttrValue[]
//属性对象
export interface Attr{
  id?:number;
  attrName:string,
  categoryId:number|string,
  categoryLevel:number,
  attrValueList:AttrValueList
}
//属性对象数组
export type AttrList=Attr[];
//属性接口返回数据ts类型
export interface AttrResponseData extends ResponseData{
  data:Attr[]
}