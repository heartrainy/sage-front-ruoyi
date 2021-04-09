import React, { useState, useEffect, useImperativeHandle } from 'react';
import pathToRegexp from 'path-to-regexp'
import { Tabs, Menu, Dropdown, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useLocation, useIntl, history, dropByCacheKey, connect } from 'umi';
import './style.less';

const dynamicRoutes = [
  '/dict/type/data/:dictId'
]

const { TabPane } = Tabs;

const TabBar = (props) => {
  const location = useLocation();
  let { pathname } = location;
  const {
    filterRouters,
    tabActiveKey,
    tabPanes,
    menuOpenKeys,
    allPath
  } = props;

  pathname = pathname === '/' ? '/home' : pathname

  // 初始化
  useEffect(() => {
    
  }, []);

  // 获取菜单展开Keys
  const getMenuOpen = (key) => {
    let newMenuOpenKeys = []
    const loopMenuOpen = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].path === key) {
          break
        }
        if (list[i].children && key.includes(list[i].path)) {
          newMenuOpenKeys.push(list[i].path)
          loopMenuOpen(list[i].children)
        }
      }
    }
    loopMenuOpen(filterRouters)
    // 三级菜单跳二级菜单 不收起
    if (newMenuOpenKeys.length === 1) {
      if (menuOpenKeys.includes(newMenuOpenKeys[0])) {
        newMenuOpenKeys = menuOpenKeys.slice()
      }
    }

    return newMenuOpenKeys
  }

  const onChange = (activekey) => {
    // console.log(activekey)
    if (activekey !== tabActiveKey) {

      const newMenuOpenKeys = getMenuOpen(activekey)

      props.dispatch({
        type: 'global/updateState',
        payload: {
          tabActiveKey: activekey,
          menuSelectedKeys: [activekey],
          menuOpenKeys: newMenuOpenKeys
        }
      })

      // props.checkMenuOpen(activekey)
      // 如果是动态路由跳转过渡页
      let match = null
      for (let i = 0; i < dynamicRoutes.length; i++) {
        match = pathToRegexp(dynamicRoutes[i]).exec(activekey);
        if (match) {
          break
        }
      }
      if (match) {
        const path = match[0];
        history.push({
          pathname: '/transition',
          query: {
            path: path,
          }
        })
      } else {
        history.push(activekey);
      }
    }
  };

  const remove = (targetKey) => {
    let lastActiveKey = '/home';
    let lastIndex;
    console.log(tabActiveKey)
    tabPanes.forEach((pane, i) => {
      if (pane.path === targetKey) {
        lastIndex = i - 1;
      }
    });
    const lastPanes = tabPanes.filter((pane) => pane.path !== targetKey);
    if (lastPanes.length && tabActiveKey === targetKey) {
      if (lastIndex >= 0) {
        lastActiveKey = lastPanes[lastIndex].path;
      } else {
        lastActiveKey = lastPanes[0].path;
      }
    } else {
      lastActiveKey = lastPanes[lastPanes.length - 1].path;
    }
    // setTimeout(() => {
    const newMenuOpenKeys = getMenuOpen(lastActiveKey)

    props.dispatch({
      type: 'global/updateState',
      payload: {
        tabActiveKey: lastActiveKey,
        menuSelectedKeys: [lastActiveKey],
        menuOpenKeys: newMenuOpenKeys,
        tabPanes: lastPanes
      }
    })

    // props.checkMenuOpen(lastActiveKey)
    // 如果是动态路由跳转过渡页
    let match = null
    for (let i = 0; i < dynamicRoutes.length; i++) {
      match = pathToRegexp(dynamicRoutes[i]).exec(lastActiveKey);
      if (match) {
        break
      }
    }
    if (match) {
      const path = match[0];
      history.push({
        pathname: '/transition',
        query: {
          path: path,
        }
      })
    } else {
      history.push(lastActiveKey);
    }
  };

  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      remove(targetKey);
    }
  };

  // 刷新
  const refreshTab = (e) => {
    e.preventDefault();

    dropByCacheKey(tabActiveKey);

    // history.push('/system/role');
    if (Object.keys(location.query).length !== 0) {
      history.push({
        pathname: '/transition',
        query: {
          path: tabActiveKey,
          ...location.query
        }
      });
    } else {
      history.push({
        pathname: '/transition',
        query: {
          path: tabActiveKey
        }
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={(e) => refreshTab(e)}>刷新</a>
      </Menu.Item>
    </Menu>
  );

  // const getPanes = () => {
  //   return panes
  // }

  // 暴露外部方法
  // useImperativeHandle(ref, () => ({
  //   onChange,
  //   getPanes,
  //   setPanes,
  //   setActiveKey
  // }));

  return (
    <div className="sage-tabbar">
      <div className="sage-tabbar-left">
        <Tabs
          onChange={onChange}
          activeKey={tabActiveKey}
          type="editable-card"
          hideAdd
          tabBarGutter={4}
          onEdit={onEdit}
        >
          {tabPanes.map((pane) => (
            <TabPane tab={pane.meta.title} key={pane.path} closable={pane.name !== 'Home' } />
          ))}
        </Tabs>
      </div>
      <div className="sage-tabbar-right">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button className="sage-tabbar-button" icon={<ReloadOutlined />} size="middle" />
        </Dropdown>
      </div>
    </div>
  );
};

export default connect(({ user, global }) => ({
  routers: user.routers,
  filterRouters: user.filterRouters,
  collapsed: global.collapsed,
  menuSelectedKeys: global.menuSelectedKeys,
  menuOpenKeys: global.menuOpenKeys,
  tabActiveKey: global.tabActiveKey,
  tabPanes: global.tabPanes,
  allPath: global.allPath
}))(TabBar);
