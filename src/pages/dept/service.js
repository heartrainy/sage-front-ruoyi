import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryDept(params) {
  return request(`/${requestPrefix}/party/orgn/queryOrgn`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function removeDept(params) {
  return request(`/${requestPrefix}/party/orgn/delete`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function addDept(params) {
  return request(`/${requestPrefix}/party/orgn/save`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateDept(params) {
  return request(`/${requestPrefix}/party/orgn/edit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getDeptDetail(params) {
  return request(`/${requestPrefix}/party/orgn/selectById`, {
    method: 'POST',
    data: { ...params },
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/party/orgn/openOrClose`, {
    method: 'POST',
    data: { ...params },
  });
}
