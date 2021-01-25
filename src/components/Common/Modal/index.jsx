import React, { useState, useImperativeHandle } from 'react'
import { Modal } from 'antd'

import './style.less'

const initState = {
  visible: false,
  maskClosable: false,
  destroyOnClose: false,
  title: null
}

const SageModal = (props, ref) => {

  const {
    visible: visibleProps,
    maskClosable: maskClosableProps,
    title: titleProps,
    destroyOnClose: destroyOnCloseProps,
    ...modalProps
  } = props

  const [visible, setVisible] = useState(initState.visible)
  const [maskClosable] = useState(initState.maskClosable)
  const [title, setTitle] = useState(initState.title)
  const [destroyOnClose] = useState(initState.destroyOnClose)

  const visibleState = visibleProps !== undefined ? visibleProps : visible
  const mastClosableState = maskClosableProps !== undefined ? maskClosableProps : maskClosable
  const titleState = titleProps !== undefined ? titleProps : title
  const destroyOnCloseState = destroyOnCloseProps !== undefined ? destroyOnCloseProps : destroyOnClose

  const onCancel = () => {
    setVisible(false)
  }

  // const onOk = () => {

  // }

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    setVisible,
    setTitle
  }))

  return (
    <div className="sage-modal">
      <Modal
        title={titleState}
        visible={visibleState}
        maskClosable={mastClosableState}
        destroyOnClose={destroyOnCloseState}
        onCancel={onCancel}
        // onOk={onOk}
        {...modalProps}
      >
        {props.children}
      </Modal>
    </div>
  )
}

export default React.forwardRef(SageModal)
