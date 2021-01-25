import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix'

export async function queryTenant(params) {
  return request(`/${requestPrefix}/sage-party/party/test/queryList`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function removeCrud(params) {
  return request(`/${requestPrefix}/sage-party/party/test/deleteBatch`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function addTenant(params) {
  return request(`/${requestPrefix}/sage-party/party/test/saveOrEdit`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateTenant(params) {
  return request(`/${requestPrefix}/sage-party/party/test/saveOrEdit`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询
export function getTenantDetail(params) {
  return request(`/${requestPrefix}/sage-party/party/test/selectById`, {
    method: 'POST',
    data: { ...params },
  })
}
