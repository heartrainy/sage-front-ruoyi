import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryDept(params) {
  return request(`/${requestPrefix}/system/dept/list`, {
    method: 'GET',
    params: { ...params }
  });
}

export async function removeDept(params) {
  return request(`/${requestPrefix}/system/dept/${params.deptId}`, {
    method: 'DELETE'
  });
}

export async function addDept(params) {
  return request(`/${requestPrefix}/system/dept`, {
    method: 'POST',
    data: { ...params },
  });
}

export async function updateDept(params) {
  return request(`/${requestPrefix}/system/dept`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getDeptDetail(params) {
  return request(`/${requestPrefix}/system/dept/${params.deptId}`, {
    method: 'GET'
  });
}

// 根据当前部门查询上级部门可选数据
export async function queryDeptExclude(params) {
  return request(`/${requestPrefix}/system/dept/list/exclude/${params.deptId}`, {
    method: 'GET'
  });
}

export function openOrClose(params) {
  return request(`/${requestPrefix}/party/orgn/openOrClose`, {
    method: 'POST',
    data: { ...params },
  });
}

// 查询部门数据
export async function getTreeSelect(params) {
  return request(`/${requestPrefix}/system/dept/treeselect`, {
    method: 'GET'
  });
}