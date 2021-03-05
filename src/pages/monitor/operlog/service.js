import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryOper(params) {
  return request(`/${requestPrefix}/monitor/operlog/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeOper(params) {
  return request(`/${requestPrefix}/monitor/operlog/${params.operId}`, {
    method: 'DELETE'
  });
}
export async function addOper(params) {
  return request(`/${requestPrefix}/monitor/operlog`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateOper(params) {
  return request(`/${requestPrefix}/monitor/operlog`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 导出
export async function exportOper(params) {
  return request(`/${requestPrefix}/monitor/operlog/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 清空
export async function clean() {
  return request(`/${requestPrefix}/monitor/operlog/clean`, {
    method: 'DELETE'
  })
}


