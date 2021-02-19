/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useIntl, connect, history, FormattedMessage, KeepAliveLayout } from 'umi';
import { createFromIconfontCN, GithubOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Result, Button, Menu } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import TabBar from '@/components/TabBar';
import GlobalFooter from '@/components/GlobalFooter';
import { getAuthorityFromRouter, deepClone } from '@/utils/utils';
import { getRouter } from '@/services/user';
import logo from '../assets/logo.png';

import './BasicLayout.less'

const { SubMenu } = Menu;

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    currentUser,
    routers,
    route,
    collapsed,
    menuSelectedKeys,
    menuOpenKeys,
    // tabActiveKey
  } = props;

  // const [selectedKeys, setSelectedKeys] = useState([location.pathname])
  // const [openKeys, setOpenKeys] = useState([])

  const IconFont = createFromIconfontCN({
    scriptUrl: settings.iconfontUrl,
  });

  /**
   * constructor
   */

  // const tabBarRef = useRef();

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  // const handlePageChange = ({ pathname }) => {
  //   if (tabBarRef.current) {
  //     tabBarRef.current.onChange(pathname, true);
  //   }
  // };

  // const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
  //   authority: undefined,
  // };
  // const { formatMessage } = useIntl();

  // 处理左侧菜单数据
  const filterMenuTree = (list, parentPath) => {
    list.forEach(item => {
      if (parentPath && !item.path.includes('http')) {
        item.path = parentPath + '/' + item.path
      }
      if (item.children) {
        filterMenuTree(item.children, item.path)
      }
    })
  }

  // 获取左侧菜单
  const getMenuTree = () => {
    const list = deepClone(routers)
    filterMenuTree(list)

    // 添加固定路由
    list.unshift({
      hidden: false,
      meta: {
        icon: 'dashboard',
        title: '首页'
      },
      name: 'Home',
      path: '/home'
    })
    // console.log(list)
    return list
  }

  const menuTree = useMemo(() => getMenuTree(), [routers])


  // 递归显示菜单
  const getMenuChildren = (menuChildren) => {
    return menuChildren.map(item => {
      if (item.children) {
        return (
          <SubMenu key={item.path} icon={<IconFont type={`icon-${item.meta.icon}`} />} title={item.meta.title}>
            {
              getMenuChildren(item.children)
            }
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.path} icon={<IconFont type={`icon-${item.meta.icon}`} />}>
          {item.meta.title}
        </Menu.Item>
      )
    })
  }

  // 选中菜单
  const handleSelectMenu = ({ item, key }) => {
    props.dispatch({
      type: 'global/updateState',
      payload: {
        menuSelectedKeys: [key],
        tabActiveKey: key
      }
    })
    // setSelectedKeys([key])

    props.dispatch({
      type: 'global/checkPaneExist',
      payload: {
        path: key
      }
    })

    history.push(key)
    // if (tabBarRef.current) {
    //   tabBarRef.current.onChange(key, true);
    // }
  }

  const handleOpenChange = (_openKeys) => {
    props.dispatch({
      type: 'global/updateState',
      payload: {
        menuOpenKeys: _openKeys.length > 1 ? [_openKeys.slice().pop()] : _openKeys
      }
    })
    // setOpenKeys(_openKeys.length > 1 ? [_openKeys.slice().pop()] : _openKeys)
  }

  // 判断菜单展开折叠
  const checkMenuOpen = (key) => {
    const loopMenuOpen = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].path === key) {
          if (list[i].parentPath) {
            props.dispatch({
              type: 'global/updateState',
              payload: {
                menuOpenKeys: [list[i].parentPath]
              }
            })
            // setOpenKeys([list[i].parentPath])
          }
          // setOpenKeys(list[i].parentPath ? [list[i].parentPath] : [])
          break
        }
        if (list[i].children) {
          loopMenuOpen(list[i].children)
        }
      }
    }
    loopMenuOpen(menuTree)
  }

  useEffect(() => {
    let currentPath = location.pathname
    if (currentPath === '/') {
      currentPath = '/home'
    }

    dispatch({
      type: 'user/getRouters'
    })

    dispatch({
      type: 'global/updateState',
      payload: {
        menuSelectedKeys: [currentPath]
      }
    })
    // checkMenuOpen(currentPath)

  }, []);
  /**
   * init variables
   */

  // 跳转到个人中心
  const goCenter = () => {
    checkMenuOpen('/system/center')
    handleSelectMenu({ key: '/system/center' })
    // const panes = tabBarRef.current.getPanes()
    // if (!panes.some(item => item.key === '/system/center')) {
    //   panes.push({
    //     title: '个人中心',
    //     key: '/system/center'
    //   })
    //   tabBarRef.current.setPanes(panes);
    // }
    // tabBarRef.current.setActiveKey('/system/center');
    // history.push('/system/center');
  }

  return (

    <div className={`sage-app-wrapper ${collapsed ? 'hideSidebar' : ''}`}>
      <div className="sage-sidebar-container">
        <div className="sidebar-logo-container">
          <a href="/" className="sage-sidebar-logo-link">
            <img src={logo} className="sage-sidebar-logo" />
            <h1 className="sage-sidebar-title">Sage FrameWork</h1>
          </a>
        </div>
        <div className="sage-sider-menu">
          <div className="sage-sider-menu-wrapper">
            <Menu
              style={{ width: '100%' }}
              selectedKeys={menuSelectedKeys}
              openKeys={menuOpenKeys}
              mode="inline"
              theme="dark"
              onSelect={handleSelectMenu}
              onOpenChange={handleOpenChange}
              inlineCollapsed={collapsed}
            >
              {
                getMenuChildren(menuTree)
              }
            </Menu>
          </div>
        </div>
      </div>
      <div className="sage-main-container">
        <div className="sage-fixed-header">
          <div className="sage-navbar">
            <div className="sage-hamburger-container" style={{ padding: '0 15px' }} onClick={() => handleMenuCollapse(!collapsed)}>
              {
                collapsed ? <MenuUnfoldOutlined style={{ fontSize: '20px' }} /> : <MenuFoldOutlined style={{ fontSize: '20px' }} />
              }
            </div>
            <RightContent goCenter={goCenter} />
          </div>
          <TabBar
            // ref={tabBarRef}
            currentUser={currentUser}
            // menuTree={menuTree}
            // setSelectedKeys={setSelectedKeys}
            checkMenuOpen={checkMenuOpen}
          />
        </div>

        <div className="sage-app-main">
          <div className="sage-dashboard-container">
            <KeepAliveLayout {...props}>{children}</KeepAliveLayout>
          </div>
          <GlobalFooter />
        </div>
      </div>
    </div>
    // <ProLayout
    //   logo={logo}
    //   formatMessage={formatMessage}
    //   menuHeaderRender={(logoDom, titleDom) => (
    //     <Link to="/">
    //       {logoDom}
    //       {titleDom}
    //     </Link>
    //   )}
    //   onCollapse={handleMenuCollapse}
    //   onPageChange={handlePageChange}
    //   menuItemRender={(menuItemProps, defaultDom) => {
    //     if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
    //       return defaultDom;
    //     }

    //     return <Link to={menuItemProps.path}>{defaultDom}</Link>;
    //   }}
    //   breadcrumbRender={(routers = []) => [
    //     {
    //       path: '/',
    //       breadcrumbName: formatMessage({
    //         id: 'menu.home',
    //       }),
    //     },
    //     ...routers,
    //   ]}
    //   itemRender={(route, params, routes, paths) => {
    //     const first = routes.indexOf(route) === 0;
    //     return first ? (
    //       <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    //     ) : (
    //       <span>{route.breadcrumbName}</span>
    //     );
    //   }}
    //   footerRender={() => defaultFooterDom}
    //   menuDataRender={menuDataRender}
    //   rightContentRender={() => <RightContent />}
    //   {...props}
    //   {...settings}
    // >
    //   <TabBar ref={tabBarRef} currentUser={currentUser} />
    //   <Authorized authority={authorized.authority} noMatch={noMatch}>
    //     <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
    //       <KeepAliveLayout {...props}>{children}</KeepAliveLayout>
    //     </div>
    //   </Authorized>
    //   <GlobalFooter />
    // </ProLayout>
  );
};

export default connect(({ user, global, settings }) => ({
  routers: user.routers,
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  menuSelectedKeys: global.menuSelectedKeys,
  menuOpenKeys: global.menuOpenKeys,
  tabActiveKey: global.tabActiveKey,
  settings,
}))(BasicLayout);
