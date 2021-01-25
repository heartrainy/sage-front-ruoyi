import sageRequest from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function query() {
  return sageRequest('/api/users');
}
export async function queryCurrent() {
  return sageRequest(`/${requestPrefix}/party/userInfo`);
}
export async function queryNotices() {
  return sageRequest('/api/notices');
}
