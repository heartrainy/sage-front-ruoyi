import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryJob(params) {
  return request(`/${requestPrefix}/monitor/job/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeJob(params) {
  return request(`/${requestPrefix}/monitor/job/${params.jobId}`, {
    method: 'DELETE'
  });
}
export async function addJob(params) {
  return request(`/${requestPrefix}/monitor/job`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateJob(params) {
  return request(`/${requestPrefix}/monitor/job`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getJobDetail(params) {
  return request(`/${requestPrefix}/monitor/job/${params.jobId}`, {
    method: 'GET'
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/monitor/job/changeStatus`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 导出
export async function exportJob(params) {
  return request(`/${requestPrefix}/monitor/job/export`, {
    method: 'GET',
    params: {...params}
  })
}


// 执行
export async function runJob(params) {
  return request(`/${requestPrefix}/monitor/job/run`, {
    method: 'PUT',
    data: {...params}
  })
}


