import React from 'react'
import { Popconfirm, Divider } from 'antd'

/**
 *
 * @param {*} props
 * actionList []
 */
const ActionSet = (props) => {
  const { actionList: actionListProps } = props

  const actionListState = actionListProps !== undefined ? actionListProps : []

  return (
    actionListState.map((item, index) => {
      return (
        <span key={item.key ? item.key : `action_key_${index}`}>
          {
            item.isConfirm ?
            <Popconfirm
              placement="topLeft"
              title={item.confirmInfo}
              onConfirm={item.method}
              okText="确定"
              cancelText="取消">
              <a onClick={(e) => e.stopPropagation()}>{item.title}</a>
            </Popconfirm> : <a onClick={item.method}>{item.title}</a>
          }
          {
            index < actionListState.length - 1 ?
              <Divider type="vertical" /> : null
          }
        </span>
      )
    })
  )
}

export default ActionSet
