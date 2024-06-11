import request from '@/utils/request'
import type { PermissionResponseData, MenuParams } from './type'
enum API {
  ALLPERMISSION_URL = 'admin/acl/permission',
  //新增
  ADDMENU_URL = '/admin/acl/permission/save',
  UPDATE_URL = '/admin/acl/permission/update',
  DELETE_URL ='/admin/acl/permission/remove/'
}
//获取菜单数据
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
//添加更新菜单
export const reqAddOrUpdate = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }

}
export const reqRemove=(id:number)=>request.delete<any,any>(API.DELETE_URL+id)