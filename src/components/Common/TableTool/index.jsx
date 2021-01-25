import React from 'react'
import { Tooltip } from 'antd'
import { FileSearchOutlined, FileSyncOutlined, SettingOutlined } from '@ant-design/icons';
import DensityIcon from './components/DensityIcon/index'
import FullscreenIcon from './components/FullscreenIcon/index'
import ColumnSetting from './components/ColumnSetting'
import './style.less'

const defatultToolOption = ['reload', 'hiddensearch', 'density', 'fullScreen', 'setting']

/**
 *
 * @param {} props
 */
const SageTableTool = (props) => {

  const {
    toolBarRender,
    toolOptionConfig,
    tableSize,
    isFullscreen,
    onRefreshTable,
    onChangeSize,
    onHiddeSearch,
    onChangeColumnsHidden,
    onChangeAllColumns,
    onResetColumns,
    setFull,
    exitFull,
    columns,
  } = props

  // 控制工具按钮显示
  let toolDom = null
  let toolOption = []
  if (toolOptionConfig !== null) {
    if (toolOptionConfig === undefined) {
      toolOption = defatultToolOption
    } else {
      toolOption = toolOptionConfig.slice()
    }
  }

  toolDom = toolOption.map(item => {
    let eachDom = null
    switch (item) {
      case 'reload':
        eachDom = (
          <span className="sage-table-toolbar-item" key={`sage-table-toolbar-item-${item}`}>
            <Tooltip title="刷新表格">
              <FileSyncOutlined className="table-tool-icon" onClick={onRefreshTable} />
            </Tooltip>
          </span>
        )
        break;
      case 'hiddensearch':
        eachDom = (
          <span className="sage-table-toolbar-item" key={`sage-table-toolbar-item-${item}`}>
            <Tooltip title="搜索栏">
              <FileSearchOutlined className="table-tool-icon" onClick={onHiddeSearch} />
            </Tooltip>
          </span>
        )
        break;
      case 'density':
        eachDom = (
          <span className="sage-table-toolbar-item" key={`sage-table-toolbar-item-${item}`}>
            <DensityIcon tableSize={tableSize} onChangeSize={onChangeSize} />
          </span>
        )
        break;
      case 'fullScreen':
        eachDom = (
          <span className="sage-table-toolbar-item" key={`sage-table-toolbar-item-${item}`}>
            <FullscreenIcon isFullscreen={isFullscreen} setFull={setFull} exitFull={exitFull} />
          </span>
        )
        break;
      case 'setting':
        eachDom = (
          <span className="sage-table-toolbar-item" key={`sage-table-toolbar-item-${item}`}>
            <Tooltip title="列设置">
              <ColumnSetting
                onChangeColumnsHidden={onChangeColumnsHidden}
                onChangeAllColumns={onChangeAllColumns}
                onResetColumns={onResetColumns}
                columns={columns}
              />
            </Tooltip>
          </span>
        )
        break;
      default:
        break;
    }
    return eachDom
  })

  return (
    <div className="sage-table-toolbar">
      <div className="sage-table-toolbar-button">
        {toolBarRender ? toolBarRender() : null}
      </div>
      <div className="sage-table-toolbar-option">
        {toolDom}
      </div>
    </div>
  )
}

export default SageTableTool
