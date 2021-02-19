import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryRole(params) {
  return request(`/${requestPrefix}/system/role/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeRole(params) {
  return request(`/${requestPrefix}/system/role/${params.roleId}`, {
    method: 'DELETE'
  });
}
export async function addRole(params) {
  return request(`/${requestPrefix}/system/role`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateRole(params) {
  return request(`/${requestPrefix}/system/role`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getRoleDetail(params) {
  return request(`/${requestPrefix}/system/role/${params.roleId}`, {
    method: 'GET'
  });
}

// 改变状态
export function openOrClose(params) {
  return request(`/${requestPrefix}/system/role/changeStatus`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 获取菜单权限
export async function getMenuByRoleId(params) {
  return request(`/${requestPrefix}/system/menu/roleMenuTreeselect/${params.roleId}`, {
    method: 'GET'
  });
}


