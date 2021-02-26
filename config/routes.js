export default [
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
    path: '/sageformdesign',
    component: '../components/SageFormDesign'
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
        // Routes: ['src/pages/Authorized'],
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
          // 系统管理
          // {
          //   path: '/system',
          //   name: 'system',
          //   routes: [
          //     {
          //       path: '/system/role',
          //       name: 'role',
          //       component: './role',
          //     },
          //     {
          //       path: '/system/menu',
          //       name: 'menu',
          //       component: './menu',
          //     },
          //     {
          //       path: '/system/dept',
          //       name: 'dept',
          //       component: './dept',
          //     },
          //     {
          //       path: '/system/user',
          //       name: 'user',
          //       component: './user/manage',
          //     },
          //     {
          //       path: '/system/center',
          //       name: 'center',
          //       component: './user/center',
          //     },
          //   ],
          // },
          // 系统监控
          {
            path: '/monitor',
            name: 'monitor',
            routes: [
              {
                path: '/monitor/online',
                name: 'online',
                component: './role',
              },
              {
                path: '/monitor/job',
                name: 'job',
                component: './menu',
              },
              {
                path: '/monitor/druid',
                name: 'druid',
                component: './dept',
              },
              {
                path: '/monitor/server',
                name: 'server',
                component: './user/manage',
              },
              {
                path: '/monitor/cache',
                name: 'cache',
                component: './user/center',
              },
            ],
          },
          // demo例子
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
  }
];
