import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryServer() {
  return request(`/${requestPrefix}/monitor/server`, {
    method: 'GET'
  });
}