import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryUser(params) {
  return request(`/${requestPrefix}/system/user/list`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function removeUser(params) {
  return request(`/${requestPrefix}/system/user/${params.userId}`, {
    method: 'DELETE'
  });
}
export async function addUser(params) {
  return request(`/${requestPrefix}/system/user`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateUser(params) {
  return request(`/${requestPrefix}/system/user`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getUserDetail(params) {
  return request(`/${requestPrefix}/system/user/${params.userId}`, {
    method: 'GET'
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/system/user/changeStatus`, {
    method: 'PUT',
    data: { ...params },
  });
}

export function resetPwd(params) {
  return request(`/${requestPrefix}/system/user/resetPwd`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 获取岗位和角色下拉数据
export function getPostsAndRoles() {
  return request(`/${requestPrefix}/system/user/`, {
    method: 'GET'
  });
}

// 导出角色
export async function exportUser(params) {
  return request(`/${requestPrefix}/system/user/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 导入角色
export async function importUser(params) {
  return request(`/${requestPrefix}/system/user/importData?updateSupport=${params.updateSupport}`, {
    method: 'POST',
    data: params.file
  })
}

// 导入角色
export async function uploadTemplate() {
  return request(`/${requestPrefix}//system/user/importTemplate`, {
    method: 'GET'
  })
}