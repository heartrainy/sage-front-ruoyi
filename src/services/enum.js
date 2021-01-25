import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

// 查询
export function getEnumDropDownList(params) {
  return request(`/${requestPrefix}/sys/common/getEnumDropDownList`, {
    method: 'POST',
    data: { ...params },
  });
}
