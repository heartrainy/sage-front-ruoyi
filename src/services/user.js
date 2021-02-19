import sageRequest from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function query() {
  return sageRequest('/api/users');
}
export async function queryCurrent() {
  return sageRequest(`/${requestPrefix}/getInfo`);
}
export async function queryNotices() {
  return sageRequest('/api/notices');
}
export async function getRouters() {
  return sageRequest(`/${requestPrefix}/getRouters`);
}