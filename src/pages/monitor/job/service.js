import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryNotice(params) {
  return request(`/${requestPrefix}/system/notice/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeNotice(params) {
  return request(`/${requestPrefix}/system/notice/${params.noticeId}`, {
    method: 'DELETE'
  });
}
export async function addNotice(params) {
  return request(`/${requestPrefix}/system/notice`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updateNotice(params) {
  return request(`/${requestPrefix}/system/notice`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getNoticeDetail(params) {
  return request(`/${requestPrefix}/system/notice/${params.noticeId}`, {
    method: 'GET'
  });
}


