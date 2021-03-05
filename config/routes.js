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

          // },
          // 字典数据详情页
          {
            path: '/dict/type/data/:dictId(\\d+)',
            component: './system/dictdata/index',
          },
          // 过渡页
          {
            path: '/transition',
            component: './Transition'
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
