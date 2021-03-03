import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryDict(params) {
  return request(`/${requestPrefix}/system/dict/type/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeDict(params) {
  return request(`/${requestPrefix}/system/dict/type/${params.dictId}`, {
    method: 'DELETE'
  });
}
export async function addDict(params) {
  return request(`/${requestPrefix}/system/dict/type`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateDict(params) {
  return request(`/${requestPrefix}/system/dict/type`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getDictDetail(params) {
  return request(`/${requestPrefix}/system/dict/type/${params.dictId}`, {
    method: 'GET'
  });
}

// 导出
export async function exportDict(params) {
  return request(`/${requestPrefix}/system/dict/type/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 清理缓存
export async function clearCache() {
  return request(`/${requestPrefix}/system/dict/type/clearCache`, {
    method: 'DELETE'
  })
}


