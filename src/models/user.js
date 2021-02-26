import { queryCurrent, query as queryUsers, getRouters } from '@/services/user';
import { deepClone } from '@/utils/utils';

// 处理原路由数据中的path字段
const filterRouterPath = (list, parentPath) => {
  list.forEach(item => {
    if (parentPath && !item.path.includes('http')) {
      item.path = parentPath + '/' + item.path
      item.parentPath = parentPath
    }
    if (item.children) {
      filterRouterPath(item.children, item.path)
    }
  })
}

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    permissions: [],
    routers: [],    // 接口返回路由原数据
    filterRouters: [],    // 处理path字段后的路由数据
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
        const routers = deepClone(response.data)
        // 添加固定路由
        routers.unshift({
          hidden: false,
          meta: {
            icon: 'dashboard',
            title: '首页'
          },
          name: 'Home',
          path: '/home'
        })

        // 处理原路由数据中的path字段
        const filterRouters = deepClone(routers)
        filterRouterPath(filterRouters)

        // 处理后的路由数据保存到global
        yield put({
          type: 'global/saveRouters',
          payload: {
            routers,
            filterRouters
          }
        })

        // 初始化tabbar和menu
        yield put({
          type: 'global/initTabAndMenu',
          payload: {
            filterRouters
          }
        })

        yield put({
          type: 'saveRouters',
          payload: {
            routers,
            filterRouters
          }
        });
      }
    }
  },
  reducers: {
    saveRouters(state, { payload }) {
      return { 
        ...state, 
        routers: payload.routers || [],  
        filterRouters: payload.filterRouters || []
      };
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
