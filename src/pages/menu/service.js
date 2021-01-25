import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryMenu(params) {
  return request(`/${requestPrefix}/party/menu/menu`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeMenu(params) {
  return request(`/${requestPrefix}/party/menu/delete`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function addMenu(params) {
  return request(`/${requestPrefix}/party/menu/save`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateMenu(params) {
  return request(`/${requestPrefix}/party/menu/edit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getMenuDetail(params) {
  return request(`/${requestPrefix}/party/menu/selectById`, {
    method: 'POST',
    data: { ...params },
  });
}

// 更新缓存
export function clearMenu() {
  return request(`/${requestPrefix}/party/menu/clearMenu`, {
    method: 'GET',
  });
}
