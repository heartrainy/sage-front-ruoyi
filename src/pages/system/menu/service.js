import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryMenu(params) {
  return request(`/${requestPrefix}/system/menu/list`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function removeMenu(params) {
  return request(`/${requestPrefix}/system/menu/${params.menuId}`, {
    method: 'DELETE'
  });
}
export async function addMenu(params) {
  return request(`/${requestPrefix}/system/menu`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateMenu(params) {
  return request(`/${requestPrefix}/system/menu`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getMenuDetail(params) {
  return request(`/${requestPrefix}/system/menu/${params.menuId}`, {
    method: 'GET'
  });
}
