import { getRouters } from '@/services/user'
import { deepClone } from './utils/utils';

let authRoutes = [];

// function addComponent (list) {
//   list.forEach(item => {
//     if (item.children && item.children.length !== 0) {
//       delete item.component
//       item.routes = deepClone(item.children)
//       if (item.redirect) {
//         delete item.redirect
//       }
//       addComponent(item.routes)
//     } else {
//       item.exact = true
//       // const component = require(`@/pages/${item.component}`).default
//       // console.log(typeof item.component)
//       item.component = require(`@/pages/${item.component}`).default
//       if (item.redirect) {
//         delete item.redirect
//       }
//     }
//   })
// }


// 过滤出需要添加组件的路由地址
let componentPathList = []
function filterComponentList(list) {
  // console.log(list)
  list.forEach(item => {
    if (item.children && item.children.length !== 0) {
      filterComponentList(item.children)
    } else {
      if (typeof item.component === 'string')
        componentPathList.push({
          path: item.path,
          component: item.component
        })
    }
  })
}

export function patchRoutes({ routes }) {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === '/') {
      // 添加权限路由
      componentPathList = []
      filterComponentList(authRoutes)
      componentPathList.forEach((item, index) => {
        const component = {
          path: item.path,
          exact: true,
          component: require(`@/pages/${item.component}.jsx`).default,
        }

        routes[i].routes[0].routes.splice(2 + index, 0, component)
      })

      // 添加不匹配路由跳转404页面
      routes[i].routes[0].routes.forEach(item => {
        if (item.routes && item.routes.length !== 0) {
          item.routes.push(
            {
              path: '*',
              exact: true,
              // redirect: '/404',
              component: require(`@/pages/exception/404`).default,
            }
          )
        }
      })
    }
  }
}

// 处理原路由数据中的path字段
function filterRouterPath(list, parentPath) {
  list.forEach(item => {
    if (parentPath && !item.path.includes('http')) {
      item.path = parentPath + '/' + item.path
    }
    if (item.children) {
      filterRouterPath(item.children, item.path)
    }
  })
}

// 请求动态路由
export async function render(oldRender) {
  let res = null
  if (localStorage.token) {
    res = await getRouters()
  }
  // console.log('请求了')
  window.oldRender = () => {
    if (res && res.code === 200) {
      authRoutes = res.data;
      filterRouterPath(authRoutes)

    } else {
      oldRender();
    }
    oldRender();
  }
  if (window.oldRender) {
    window.oldRender();
  }
}
