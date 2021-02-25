import { queryCurrent, query as queryUsers, getRouters } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    permissions: [],
    routers: []
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 200) {
        const userInfo = response.user

        userInfo.name = userInfo.userName || '创世者'
        userInfo.avatar = userInfo.avatar ? `/ebd/sys/file/showImage?imageId=${userInfo.user.headImage}` : 'http://static.titian365.com/person_logo.png'

        yield put({
          type: 'saveCurrentUser',
          payload: { user: userInfo, permissions: response.permissions }
        });
      }
    },
    *getRouters(_, { call, put }) {
      const response = yield call(getRouters);
      if (response.code === 200) {
        const routers = response.data

        yield put({
          type: 'saveRouters',
          payload: routers,
        });
      }
    }
  },
  reducers: {
    saveRouters(state, action) {
      return { ...state, routers: action.payload || [] };
    },
    saveCurrentUser(state, { payload }) {
      return { 
        ...state, 
        currentUser: payload.user || {}, 
        permissions: payload.permissions || [] 
      }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
