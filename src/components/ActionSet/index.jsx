import React from 'react'
import { Popconfirm, Divider } from 'antd'
import AuthButton from '../AuthButton'

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
              <AuthButton auth={item.auth} type="link" size="small" onClick={(e) => e.stopPropagation()}>{item.title}</AuthButton>
            </Popconfirm> : <AuthButton auth={item.auth} type="link" size="small" onClick={item.method}>{item.title}</AuthButton>
          }
          {
            // index < actionListState.length - 1 ?
            //   <Divider type="vertical" style={{margin: '0'}} /> : null
          }
        </span>
      )
    })
  )
}

export default ActionSet
