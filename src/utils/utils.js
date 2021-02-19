import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};


/**
 * 延迟执行
 * @param {*} time 毫秒数
 */
export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
* 深度拷贝，适用于任何类型，针对于引用类型如数组，对象，函数（其实函数和数据也属于object，这里描述易于理解和区分）
* PS:对象的简易克隆小技巧：var tmpObj = JSON.parse(JSON.stringify(传入对象)); 把应用类型序列化之后，变成了基本类型，基本类型不具有引用类型的地址引用特性，再把序列化猴的字符串反序列化为对象即可
* @param {*} obj
* @returns
*/
export const deepClone = (obj) => {
   var o;
   if (typeof obj == "object") {
       if (obj === null) {
           o = null;
       } else {
           if (obj instanceof Array) {
               o = [];
               for (var i = 0, len = obj.length; i < len; i++) {
                   o.push(deepClone(obj[i]));
               }
           } else {
               o = {};
               for (var j in obj) {
                   o[j] = deepClone(obj[j]);
               }
           }
       }
   } else {
       o = obj;
   }
   return o;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}