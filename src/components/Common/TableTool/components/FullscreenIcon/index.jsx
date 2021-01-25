import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import './style.less'

const FullScreenIcon = (props) => {

  const {isFullscreen, setFull, exitFull} = props

  return isFullscreen ? (
    <Tooltip title="退出全屏">
      <FullscreenExitOutlined onClick={exitFull} />
    </Tooltip>
  ) : (
    <Tooltip title="全屏">
      <FullscreenOutlined onClick={setFull} />
    </Tooltip>
  );
};

export default FullScreenIcon;
