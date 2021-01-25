import React, { useEffect, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Popover, Tooltip, Checkbox } from 'antd';

import './style.less'


const ColumnSetting = (props) => {

  const [plainOptions, setPlainOptions] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const setAllSelectAction = boolean => {
    props.onChangeAllColumns(boolean)
  }

  useEffect(() => {
    const allOptions = []
    const selectedArr = []
    const unselectedArr = []
    props.columns && props.columns.map(item => {
      allOptions.push({
        key: item.key,
        title: item.title
      })
      if (item.hidden) {
        unselectedArr.push(item)
      } else {
        selectedArr.push(item)
      }
    })
    setPlainOptions(allOptions)
    setIndeterminate(selectedArr.length !== 0 && unselectedArr.length !== 0)
    setCheckAll(selectedArr.length !== 0 && unselectedArr.length === 0)
  }, [props.columns])

  const content = (
    <div className="sage-table-column-setting-list">
      {
        props.columns.map((item, index) => {
          return (
            <span className="sage-table-column-setting-list-item" key={`columnKey_${item.key}`}>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    props.onChangeColumnsHidden(item.key, true)
                  } else {
                    props.onChangeColumnsHidden(item.key, false)
                  }
                }}
                checked={!item.hidden}
              >
                {item.title}
              </Checkbox>
            </span>
          )
        })
      }
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      title={
        <div className="sage-table-column-setting-title">
          <Checkbox
            indeterminate={indeterminate} 是否已选中
            checked={checkAll}
            onChange={(e) => {
              setAllSelectAction(e.target.checked);
            }}
          >
            列展示
          </Checkbox>
          <a
            onClick={() => {
              props.onResetColumns()
            }}
          >
            重置
          </a>
        </div>
      }
      trigger="click">
      <Tooltip title="列设置">
        <SettingOutlined className="table-tool-icon" />
      </Tooltip>
    </Popover>
  );
};

export default ColumnSetting;
