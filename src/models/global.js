import { history, dropByCacheKey } from 'umi'
import pathToRegexp from 'path-to-regexp'
import { deepClone } from '@/utils/utils';
import { queryNotices } from '@/services/user';

function findAddRouter (path, list) {
  let addRouter = null
  for (let i = 0; i < list.length; i++) {
    if (path.includes(list[i].path)) {
      if (path === list[i].path) {
        addRouter = deepClone(list[i])
        if (addRouter.children) {
          delete addRouter.children
        }
        break;
      } else {
        if (list[i].children && list[i].children.length !== 0) {
          addRouter = findAddRouter(path, list[i].children)
        }
      }
    }
  }
  return addRouter
}

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    menuSelectedKeys: [],
    menuOpenKeys: [],
    tabActiveKey: '/home',
    tabPanes: [
      {
        hidden: false,
        meta: {
          icon: 'dashboard',
          title: '首页'
        },
        name: 'Home',
        path: '/home'
      }
    ],
    allPath: [],
    routers: [],    // 接口返回路由原数据
    filterRouters: [],    // 处理path字段后的路由数据
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    // 跳转tab 左侧菜单中不存在
    *goTab({ payload }, { put, select }) {
      const globalState = yield select(state => state.global)

      const newState = {}
      // newState.menuSelectedKeys = [payload.path]
      newState.menuSelectedKeys = []
      newState.tabActiveKey = payload.path

      let isExist = false;
      for (let i = 0; i < globalState.tabPanes.length; i++) {
        if (globalState.tabPanes[i].path === payload.path) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        const newPanes = globalState.tabPanes.slice();
        newPanes.push({
          hidden: false,
          meta: {
            // icon: 'dashboard',
            title: payload.name
          },
          // name: 'Home',
          path: payload.path
        });
        newState.tabPanes = newPanes
      }

      if (payload.query) {
        history.push({
          pathname: payload.path,
          query: payload.query
        });
      } else {
        history.push(payload.path)
      }

      yield put({
        type: 'updateState',
        payload: {
          ...newState
        },
      });
    },
    // 返回tab
    *returnTab({ payload }, { put, select }) {
      const globalState = yield select(state => state.global)

      // dropByCacheKey(payload.closePath)

      const tabPanes = globalState.tabPanes.slice()
      let removeIndex;
      tabPanes.forEach((pane, i) => {
        if (pane.key === payload.closePath) {
          removeIndex = i;
        }
      });
      tabPanes.splice(removeIndex, 1)

      const newState = {}
      newState.menuSelectedKeys = [payload.returnPath]
      newState.tabActiveKey = payload.returnPath

      let isExist = false;
      for (let i = 0; i < tabPanes.length; i++) {
        if (tabPanes[i].key === payload.returnPath) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        const newPanes = tabPanes.slice();
        newPanes.push({
          // title: REACT_APP_ENV === 'dev' ? formatMessage({id: p.menuName}) : p.menuName,
          title: payload.returnName,
          key: payload.returnPath,
        });
        newState.tabPanes = newPanes
      } else {
        newState.tabPanes = tabPanes
      }

      history.push(payload.returnPath)

      yield put({
        type: 'updateState',
        payload: {
          ...newState
        },
      });
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    saveRouters(state, { payload }) {
      return { 
        ...state, 
        routers: payload.routers || [],  
        filterRouters: payload.filterRouters || []
      };
    },
    initTabAndMenu(state, { payload }) {
      const { filterRouters } = payload
      let { pathname } = location;
      pathname = pathname === '/' ? '/home' : pathname
      
      let isExist = false;
      for (let i = 0; i < state.tabPanes.length; i++) {
        if (state.tabPanes[i].path === pathname) {
          isExist = true;
          break;
        }
      }

      if (!isExist) {
        const addTab = findAddRouter(pathname, filterRouters)

        if (addTab) {
          const newPanes = deepClone(state.tabPanes);
          newPanes.push(addTab);

          return { 
            ...state,
            menuSelectedKeys: [pathname],
            menuOpenKeys: [addTab.parentPath],
            tabActiveKey: pathname, 
            tabPanes: newPanes 
          }
        }
      }

      return {
        ...state,
        menuSelectedKeys: [pathname],
        tabActiveKey: pathname
      }
    },
    checkPaneExist(state, { payload }) {
      const { path } = payload

      let isExist = false;
      for (let i = 0; i < state.tabPanes.length; i++) {
        if (state.tabPanes[i].path === path) {
          isExist = true;
          break;
        }
      }

      console.log(isExist ? '存在' : '不存在')

      if (!isExist) {
        const addTab = findAddRouter(path, state.filterRouters)

        if (addTab) {
          const newPanes = deepClone(state.tabPanes);
          newPanes.push(addTab);

          return { 
            ...state,
            menuSelectedKeys: [path],
            menuOpenKeys: [addTab.parentPath],
            tabActiveKey: path, 
            tabPanes: newPanes 
          }
        }
      }

      return {
        ...state,
        menuSelectedKeys: [path],
        tabActiveKey: path
      }
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }

        // 监听字典数据详情页
        // const match = pathToRegexp('/dict/type/data/:dictId').exec(pathname);
        // if (match) {
        //   const path = match[0];
				// 	// dispatch action with userId
        //   history.push({
        //     pathname: '/transition',
        //     query: {
        //       path: path,
        //     }
        //   })
        // }
      });
    },
  },
};
export default GlobalModel;
