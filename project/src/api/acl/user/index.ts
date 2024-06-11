import request from '@/utils/request';
import type { SetRoleData,UserResponseData, User, AllRoleResponseData } from './type';
enum API{
  //获取已有用户账号信息
  ALLUSER_URL ='/admin/acl/user/',
  ADDUSER_URL ='/admin/acl/user/save',
  UPDATEUSER_URL ='/admin/acl/user/update',
  //获取用户全部职位
  ALLROLE_URL ='/admin/acl/user/toAssign/',
  //分配角色请求
  SETROLE_URL ='/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL ='/admin/acl/user/remove/',
  //批量删除接口
  DELETEALLUSER_URL ='/admin/acl/user/batchRemove'
}
//获取用户账号信息
export const reqUserInfo=(page:number,limit:number,username:string)=>request.get<any,UserResponseData>(API.ALLUSER_URL+`${page}/${limit}/?username=${username}`)
export const reqAddOrUpdateUser=(data:User)=>{
  if(data.id){
    return request.put<any,any>(API.UPDATEUSER_URL,data)
  }else{
    return request.post<any,any>(API.ADDUSER_URL,data)
  }
}
//获取全部职位和用户已有职位
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL+userId)
//分配职务
export const reqSetUserRole = (data: SetRoleData)=>request.post<any,any>(API.SETROLE_URL,data)
//
export const reqRemoveUser=(userId:number)=>request.delete<any,any>(API.DELETEUSER_URL+userId)
//批量删除
export const reqSelectUser=(idList:number[])=>request.delete<any,any>(API.DELETEALLUSER_URL,{data:idList})
//关键词搜素
