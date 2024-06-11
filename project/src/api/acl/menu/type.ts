//数据类型定义
export interface ResponseData{
  code:number,
  message:string,
  ok:boolean,
}
export interface Permission{
  "id"?:number ,
  "createTime": string,
  "updateTime": string,
  "pid": number,
  "name": string,
  "code": string,
  "toCode": null,
  "type": number,
  "status": null,
  "level": number,
  "children"?:PermissionList,
  select:boolean
}
export type PermissionList=Permission[]
//菜单接口返回数据
export interface PermissionResponseData extends ResponseData {
  data:PermissionList
}
//添加与修改接口
export interface MenuParams{
  id?:number,
  "code": string,
  "level": number,
  "name": string,
  "pid": number,
}