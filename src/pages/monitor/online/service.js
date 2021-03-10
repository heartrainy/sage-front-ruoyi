import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function queryOnline(params) {
  return request(`/${requestPrefix}/monitor/online/list`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function removeOnline(params) {
  return request(`/${requestPrefix}/monitor/online/${params.tokenId}`, {
    method: 'DELETE'
  });
}


