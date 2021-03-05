import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryConfig(params) {
  return request(`/${requestPrefix}/system/config/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeConfig(params) {
  return request(`/${requestPrefix}/system/config/${params.configId}`, {
    method: 'DELETE'
  });
}
export async function addConfig(params) {
  return request(`/${requestPrefix}/system/config`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateConfig(params) {
  return request(`/${requestPrefix}/system/config`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getConfigDetail(params) {
  return request(`/${requestPrefix}/system/config/${params.configId}`, {
    method: 'GET'
  });
}

// 导出
export async function exportConfig(params) {
  return request(`/${requestPrefix}/system/config/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 清理缓存
export async function clearCache() {
  return request(`/${requestPrefix}/system/config/clearCache`, {
    method: 'DELETE'
  })
}


