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

// 查询用户个人信息
export function getUserProfile() {
  return request(`/${requestPrefix}/system/user/profile`, {
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
  return request(`/${requestPrefix}/system/user/profile/updatePwd`, {
    method: 'PUT',
    params: { ...params },
  });
}

// 获取岗位和角色下拉数据
export function getPostsAndRoles() {
  return request(`/${requestPrefix}/system/user/`, {
    method: 'GET'
  });
}

// 导出用户
export async function exportUser(params) {
  return request(`/${requestPrefix}/system/user/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 导入用户
export async function importUser(params) {
  return request(`/${requestPrefix}/system/user/importData?updateSupport=${params.updateSupport}`, {
    method: 'POST',
    data: params.file,
    hideError: true
  })
}

// 下载模板
export async function uploadTemplate() {
  return request(`/${requestPrefix}/system/user/importTemplate`, {
    method: 'GET'
  })
}

// 上传头像
export async function uploadAvatar(params) {
  return request(`/${requestPrefix}/system/user/profile/avatar`, {
    method: 'POST',
    data: params.file,
  })
}