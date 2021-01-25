// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import cacheRoutes from './cacheRoutes'

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  plugins: ['@alitajs/keep-alive'],
  // 缓存页面
  keepalive: cacheRoutes.routes,
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/404',
      component: './exception/404',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          // authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              path: '/home',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            // {
            //   name: 'list.table-list',
            //   icon: 'table',
            //   path: '/list',
            //   component: './ListTableList',
            // },
            {
              path: '/system',
              name: 'system',
              icon: 'setting',
              routes: [
                {
                  path: '/system/role',
                  name: 'role',
                  icon: 'SolutionOutlined',
                  component: './role',
                },
                {
                  path: '/system/menu',
                  name: 'menu',
                  icon: 'SolutionOutlined',
                  component: './menu',
                },
                {
                  path: '/system/dept',
                  name: 'dept',
                  icon: 'SolutionOutlined',
                  component: './dept',
                },
                {
                  path: '/system/user',
                  name: 'user',
                  icon: 'SolutionOutlined',
                  component: './user/manage',
                },
                {
                  path: '/system/center',
                  name: 'center',
                  component: './user/center',
                },
              ],
            },
            {
              path: '/demo',
              name: 'demo',
              icon: 'setting',
              routes: [
                {
                  path: '/demo/crud',
                  name: 'crud',
                  icon: 'SolutionOutlined',
                  component: './demo/crud',
                },
                {
                  path: '/demo/tabcrud',
                  name: 'tabcrud',
                  icon: 'SolutionOutlined',
                  component: './demo/tabcrud',
                },
                {
                  path: '/demo/tabcrud/add',
                  name: 'crudadd',
                  component: './demo/tabcrud/components/CreateForm',
                },
                {
                  path: '/demo/tabcrud/edit',
                  name: 'crudedit',
                  component: './demo/tabcrud/components/UpdateForm',
                },
                {
                  path: '/demo/moretable',
                  name: 'moretable',
                  icon: 'SolutionOutlined',
                  component: './demo/moretable',
                },
              ],
            },
            // 添加商户
            {
              path: '/tenantsys',
              name: 'tenantsys',
              icon: 'setting',
              routes: [
                {
                  path: '/tenantsys/tenant',
                  name: 'tenant',
                  icon: 'SolutionOutlined',
                  component: './tenant/index',
                }
              ]
            },
            // 图表
            {
              path: '/charts',
              routes: [
                {
                  path: '/charts/line',
                  component: './charts/line/index',
                },
                {
                  path: '/charts/bar',
                  component: './charts/bar/index',
                },
                {
                  path: '/charts/pie',
                  component: './charts/pie/index',
                }
              ]
            },
            // 富文本
            {
              path: '/editor',
              routes: [
                {
                  path: '/editor/braft',
                  component: './editor/braft/index',
                }
              ]
            },
            // -----
            {
              path: '*',
              component: './exception/404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
