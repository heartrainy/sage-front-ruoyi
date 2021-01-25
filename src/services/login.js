import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function fakeAccountLogin(params) {
  return request(
    `/${requestPrefix}/party/login?username=${params.username}&password=${params.password}&sysType=01.platform`,
    {
      method: 'POST',
      data: params,
    },
  );
}

export async function fakeAccountLogout() {
  return request(`/${requestPrefix}/party/logout`, {
    method: 'GET',
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
