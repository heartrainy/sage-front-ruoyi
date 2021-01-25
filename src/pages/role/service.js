import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryRule(params) {
  return request(`/${requestPrefix}/party/role/queryList`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeRule(params) {
  return request(`/${requestPrefix}/party/role/delete`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function addRule(params) {
  return request(`/${requestPrefix}/party/role/save`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateRule(params) {
  return request(`/${requestPrefix}/party/role/edit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getRuleDetail(params) {
  return request(`/${requestPrefix}/party/role/selectById`, {
    method: 'POST',
    data: { ...params },
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/party/role/openOrClose`, {
    method: 'POST',
    data: { ...params },
  });
}
