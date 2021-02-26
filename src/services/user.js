import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request(`/${requestPrefix}/getInfo`);
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function getRouters() {
  return request(`/${requestPrefix}/getRouters`, {
    method: 'GET',
    hideError: true,
    ignoreBack: true
  });
}