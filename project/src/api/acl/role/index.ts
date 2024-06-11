//角色管理模块接口
import request from '@/utils/request'
import type { RoleResponseData,RoleData, MenuResponseData } from './type'
enum API {
  //获取全部职位
  ALLROLE_URL = '/admin/acl/role/',
  ADDROLE_URL ='/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取菜单与按钮数据
  ALLPERMISSION_URL ='/admin/acl/permission/toAssign/',
  //给相应职位分配权限
  SETPERMISSIONS_URL ='/admin/acl/permission/doAssign/?',
  //删除职位分配
  REMOVEROLE_URL ='/admin/acl/role/remove/'
}
//获取全部角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData,MenuResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
//新增角色
export const reqAddOrUpdateRole=(data:RoleData)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATEROLE_URL,data)
  }else{
    return request.post<any,any>(API.ADDROLE_URL,data)
  }
}
//获取全部菜单与按钮权限
export const reqAllMenuList=(roleId:number)=>request.get<any,MenuResponseData>(API.ALLPERMISSION_URL+roleId)
//下发权限
export const reqSetPermission=(roleId:number,permissionId:number[])=>request.post(API.ALLPERMISSION_URL+`roleId=${roleId}&permissionId=${permissionId}`)
//删除职位
export const reqRemoveRole=(roleId:number)=>request.delete<any,any>(API.REMOVEROLE_URL+roleId)