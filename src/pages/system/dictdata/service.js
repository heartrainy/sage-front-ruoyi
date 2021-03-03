import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryDictData(params) {
  return request(`/${requestPrefix}/system/dict/data/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeDictData(params) {
  return request(`/${requestPrefix}/system/dict/data/${params.dictCode}`, {
    method: 'DELETE'
  });
}
export async function addDictData(params) {
  return request(`/${requestPrefix}/system/dict/data`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateDictData(params) {
  return request(`/${requestPrefix}/system/dict/data`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getDictDataDetail(params) {
  return request(`/${requestPrefix}/system/dict/data/${params.dictCode}`, {
    method: 'GET'
  });
}

// 导出
export async function exportDictData(params) {
  return request(`/${requestPrefix}/system/dict/data/export`, {
    method: 'GET',
    params: {...params}
  })
}


