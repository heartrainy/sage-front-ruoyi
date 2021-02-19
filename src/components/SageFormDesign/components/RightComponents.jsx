import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { Tabs } from 'antd';
import InputForm from './ComponentProps/InputForm'
import TextareaForm from './ComponentProps/TextareaForm'
import styles from '../style.less'

const { TabPane } = Tabs;

const RightComponents = (props, ref) => {

  const { board, items} = props

  const propFormRef = useRef()

  const callback = (key) => {

  }

  const onFieldsChange = (fieldName, fieldValue) => {
    props.onChangeBoard(board.id, fieldName, fieldValue)
  }

  // 暴露外部组件方法
  useImperativeHandle(ref, () => ({
    getForm: () => {
      return propFormRef.current.getForm()
    }
  }))

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={callback} className={styles.righttab}>
        <TabPane tab="组件属性" key="1">
          { board.type === 'input' ? <InputForm ref={propFormRef} onFieldsChange={onFieldsChange} fieldValues={board.config} /> : null}
          { board.type === 'textarea' ? <TextareaForm ref={propFormRef} onFieldsChange={onFieldsChange} fieldValues={board.config} /> : null}
        </TabPane>
        <TabPane tab="表单属性" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </div>
  )
}

export default React.forwardRef(RightComponents)