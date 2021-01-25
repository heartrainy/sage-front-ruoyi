import { history, dropByCacheKey } from 'umi'
import { queryNotices } from '@/services/user';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    menuSelectedKeys: [],
    menuOpenKeys: [],
    tabActiveKey: '',
    tabPanes: [
      { title: '首页', key: '/home', closable: false }
    ],
    allPath: []
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
    // 跳转tab
    *goTab({ payload }, { put, select }) {
      const globalState = yield select(state => state.global)

      const newState = {}
      newState.menuSelectedKeys = [payload.path]
      newState.tabActiveKey = payload.path

      let isExist = false;
      for (let i = 0; i < globalState.tabPanes.length; i++) {
        if (globalState.tabPanes[i].key === payload.path) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        const newPanes = globalState.tabPanes.slice();
        newPanes.push({
          // title: REACT_APP_ENV === 'dev' ? formatMessage({id: p.menuName}) : p.menuName,
          title: payload.name,
          key: payload.path,
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
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {...state, ...payload}
    },
    checkPaneExist(state, { payload }) {
      let isExist = false;
      for (let i = 0; i < state.tabPanes.length; i++) {
        if (state.tabPanes[i].key === payload.path) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        const p = state.allPath.find((item) => {
          return item.path === payload.path;
        });
        if (p) {
          const newPanes = state.tabPanes.slice();
          newPanes.push({
            // title: REACT_APP_ENV === 'dev' ? formatMessage({id: p.menuName}) : p.menuName,
            title: p.menuName,
            key: payload.path,
          });

          return {...state, tabPanes: newPanes}
          // setPanes(newPanes);
        }
      }
      return {
        ...state
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
      });
    },
  },
};
export default GlobalModel;
