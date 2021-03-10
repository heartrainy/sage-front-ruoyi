import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryJobLog(params) {
  return request(`/${requestPrefix}/monitor/jobLog/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeJobLog(params) {
  return request(`/${requestPrefix}/monitor/jobLog/${params.jobLogId}`, {
    method: 'DELETE'
  });
}

// 导出
export async function exportJobLog(params) {
  return request(`/${requestPrefix}/monitor/jobLog/export`, {
    method: 'GET',
    params: {...params}
  })
}

// 清空
export async function clean() {
  return request(`/${requestPrefix}/monitor/jobLog/clean`, {
    method: 'DELETE'
  })
}


