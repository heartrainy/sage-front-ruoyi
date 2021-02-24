import request from '@/utils/request';
import { requestPrefix } from '@/services/prefix';

export async function fakeAccountLogin(params) {
  return request(`/${requestPrefix}/login`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogout() {
  return request(`/${requestPrefix}/logout`, {
    method: 'POST',
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// 获取验证码
export async function getCodeImg() {
  return request(`/${requestPrefix}/captchaImage`, {
    method: 'GET',
  });
}
