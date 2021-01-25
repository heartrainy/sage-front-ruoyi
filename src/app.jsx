export function patchRoutes({ routes }) {
  // 添加不匹配路由跳转404页面
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === '/') {
      routes[i].routes[0].routes.forEach(item => {
        if (item.routes && item.routes.length !== 0) {
          item.routes.push(
            {
              path: '*',
              exact: true,
              // redirect: '/404',
              component: require('@/pages/exception/404').default,
            }
          )
        }
      })
    }
  }
}
