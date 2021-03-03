import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryPost(params) {
  return request(`/${requestPrefix}/system/post/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removePost(params) {
  return request(`/${requestPrefix}/system/post/${params.postId}`, {
    method: 'DELETE'
  });
}
export async function addPost(params) {
  return request(`/${requestPrefix}/system/post`, {
    method: 'POST',
    data: { ...params },
  });
}
export async function updatePost(params) {
  return request(`/${requestPrefix}/system/post`, {
    method: 'PUT',
    data: { ...params },
  });
}

// 查询
export function getPostDetail(params) {
  return request(`/${requestPrefix}/system/post/${params.postId}`, {
    method: 'GET'
  });
}

// 导出
export async function exportPost(params) {
  return request(`/${requestPrefix}/system/post/export`, {
    method: 'GET',
    params: {...params}
  })
}


