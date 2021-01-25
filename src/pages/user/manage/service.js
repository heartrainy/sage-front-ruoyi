import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryUser(params) {
  return request(`/${requestPrefix}/party/person/queryList`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeUser(params) {
  return request(`/${requestPrefix}/party/person/delete`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function addUser(params) {
  return request(`/${requestPrefix}/party/person/save`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateUser(params) {
  return request(`/${requestPrefix}/party/person/edit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getUserDetail(params) {
  return request(`/${requestPrefix}/party/person/selectById`, {
    method: 'POST',
    data: { ...params },
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/party/person/openOrClose`, {
    method: 'POST',
    data: { ...params },
  });
}

export function modifyPwd(params) {
  return request(`/${requestPrefix}/party/modifyPwd`, {
    method: 'POST',
    data: { ...params },
  });
}
