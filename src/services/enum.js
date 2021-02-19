import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

// 查询
export function getEnumDropDownList(params) {
  return request(`/${requestPrefix}/system/dict/data/type/${params.type}`, {
    method: 'GET'
  });
}
