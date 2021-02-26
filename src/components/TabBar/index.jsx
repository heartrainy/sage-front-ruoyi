import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Tabs, Menu, Dropdown, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useLocation, useIntl, history, dropByCacheKey, connect } from 'umi';
import './style.less';

const { TabPane } = Tabs;

const TabBar = (props) => {
  const location = useLocation();
  let { pathname } = location;
  const {
    filterRouters,
    tabActiveKey,
    tabPanes,
    allPath
  } = props;

  pathname = pathname === '/' ? '/home' : pathname

  const { formatMessage } = useIntl();

  // const checkPaneExist = (path) => {
  //   let isExist = false;
  //   for (let i = 0; i < tabPanes.length; i++) {
  //     if (tabPanes[i].key === path) {
  //       isExist = true;
  //       break;
  //     }
  //   }
  //   if (!isExist) {
  //     const p = allPath.find((item) => {
  //       return item.path === path;
  //     });
  //     if (p) {
  //       const newPanes = tabPanes.slice();
  //       newPanes.push({
  //         title: REACT_APP_ENV === 'dev' ? formatMessage({id: p.menuName}) : p.menuName,
  //         key: path,
  //       });
  //       props.dispatch({
  //         type: 'global/updateState',
  //         payload: {
  //           tabPanes: newPanes
  //         }
  //       })
  //       // setPanes(newPanes);
  //     }
  //   }
  // };

  // 初始化
  useEffect(() => {
    // props.dispatch({
    //   type: 'global/checkPaneExist',
    //   payload: {
    //     path: pathname
    //   }
    // })
  }, []);

  const onChange = (activekey, fromMenu) => {
    if (activekey !== tabActiveKey) {
      // setTimeout(() => {
      props.dispatch({
        type: 'global/updateState',
        payload: {
          tabActiveKey: activekey
        }
      })
      // setActiveKey(activekey);
      // }, 200)
      if (!fromMenu) {
        props.dispatch({
          type: 'global/updateState',
          payload: {
            menuSelectedKeys: [activekey]
          }
        })
        // props.setSelectedKeys([activekey])
        props.checkMenuOpen(activekey)
        history.push(activekey);
      } else {
        checkPaneExist(activekey);
      }
    }
  };

  const remove = (targetKey) => {
    let lastActiveKey = '/home';
    let lastIndex;
    tabPanes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const lastPanes = tabPanes.filter((pane) => pane.key !== targetKey);
    if (lastPanes.length && tabActiveKey === targetKey) {
      if (lastIndex >= 0) {
        lastActiveKey = lastPanes[lastIndex].key;
      } else {
        lastActiveKey = lastPanes[0].key;
      }
    } else {
      lastActiveKey = lastPanes[lastPanes.length - 1].key;
    }
    // setTimeout(() => {
    props.dispatch({
      type: 'global/updateState',
      payload: {
        tabActiveKey: lastActiveKey,
        menuSelectedKeys: [lastActiveKey],
        tabPanes: lastPanes
      }
    })
    // setActiveKey(lastActiveKey);
    // }, 200)
    // props.dispatch({
    //   type: 'global/updateState',
    //   payload: {
    //     tabPanes: lastPanes
    //   }
    // })
    // setPanes(lastPanes);
    // props.setSelectedKeys([lastActiveKey])
    props.checkMenuOpen(lastActiveKey)
    history.push(lastActiveKey);
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
    if (location.query) {
      history.push({
        pathname: tabActiveKey,
        query: location.query
      });
    } else {
      history.push(tabActiveKey);
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
