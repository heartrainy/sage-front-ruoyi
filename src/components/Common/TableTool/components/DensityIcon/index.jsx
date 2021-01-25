import React from 'react'
import { Dropdown, Tooltip, Menu } from 'antd'
import { ColumnHeightOutlined } from '@ant-design/icons';

const DensityIcon = (props) => {

  const { tableSize, onChangeSize } = props

  return (
    <Dropdown
      // ref={ref}
      overlay={
        <Menu
          selectedKeys={[tableSize]}
          onClick={({ key }) => {
            onChangeSize(key)
          }}
          style={{
            width: 80,
          }}
        >
          <Menu.Item key="default">默认</Menu.Item>
          <Menu.Item key="middle">中等</Menu.Item>
          <Menu.Item key="small">紧凑</Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <Tooltip title="密度">
        <ColumnHeightOutlined className="table-tool-icon" />
      </Tooltip>
    </Dropdown>
  )
}

export default DensityIcon
