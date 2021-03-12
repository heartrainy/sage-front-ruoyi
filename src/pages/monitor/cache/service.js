import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryCache() {
  return request(`/${requestPrefix}/monitor/cache`, {
    method: 'GET'
  });
}