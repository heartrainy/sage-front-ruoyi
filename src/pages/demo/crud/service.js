import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryCrud(params) {
  return request(`/${requestPrefix}/party/test/queryList`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeCrud(params) {
  return request(`/${requestPrefix}/party/test/deleteBatch`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function addCrud(params) {
  return request(`/${requestPrefix}/party/test/saveOrEdit`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateCrud(params) {
  return request(`/${requestPrefix}/party/test/saveOrEdit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getCrudDetail(params) {
  return request(`/${requestPrefix}/party/test/selectById`, {
    method: 'POST',
    data: { ...params },
  });
}
