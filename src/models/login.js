import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, fakeAccountLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      if (response.isSuccess) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'success',
            type: 'account'
          },
        }); // Login successfully

        // 菜单赋值
        // localStorage.menuTree = JSON.stringify(response.data.menuTree)
        // 赋值token
        localStorage.systemToken = response.data

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            type: 'account',
            errorMessage: response.message
          },
        });
      }
    },

    *logout({ payload }, { call }) {
      const response = yield call(fakeAccountLogout, payload);

      if (response.isSuccess) {
        const { redirect } = getPageQuery(); // Note: There may be security issues, please note

        // 取消token
        localStorage.systemToken = ''

        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return { ...state, ...payload };
    },
  },
};
export default Model;
