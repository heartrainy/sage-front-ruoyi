import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryLogininfor(params) {
  return request(`/${requestPrefix}/monitor/logininfor/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeLogininfor(params) {
  return request(`/${requestPrefix}/monitor/logininfor/${params.infoId}`, {
    method: 'DELETE'
  });
}

// 导出
export async function exportLogininfor(params) {
  return request(`/${requestPrefix}/monitor/logininfor/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 清空
export async function clean() {
  return request(`/${requestPrefix}/monitor/logininfor/clean`, {
    method: 'DELETE'
  })
}


