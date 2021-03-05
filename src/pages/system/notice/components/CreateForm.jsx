import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form } from 'antd'
import BraftEditor from 'braft-editor'
import { SageForm } from '@/components/Common'
import 'braft-editor/dist/index.css'

const CreateForm = (props, ref) => {

  const [editorState, setEditorState] = useState(() => {
    BraftEditor.createEditorState(null)
  })

  const { noticeStatusOptions, noticeTypeOptions } = props

  const formRef = useRef()

  const onFinish = (values) => {
    if (props.onFinish) {
      values.noticeContent = editorState.toHTML()
      props.onFinish(values)
    }
  }

  const onFinishFailed = ({ values }) => {
    console.log(values)
  }

  const handleChange = (editorState) => {
    setEditorState(editorState)
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'noticeTitle',
      label: '公告标题',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入公告标题',
      }
    },
    {
      name: 'noticeType',
      label: '公告类型',
      type: 'select',
      options: noticeTypeOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
    },
    {
      name: 'status',
      label: '状态',
      type: 'radio',
      initialValue: '0',
      options: noticeStatusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
    },
    {
      name: 'noticeContent',
      type: 'custom',
      render: (
        <Form.Item key="noticeContent" label="内容">
          <div className="editor-wrapper">
            <BraftEditor value={editorState} onChange={handleChange} contentStyle={{height: 400}} />
          </div>
        </Form.Item>
      )
    },
  ]

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    submit: () => formRef.current.submit(),
    validateFields: (nameList) => formRef.current.validateFields(nameList),
    getFieldsValue: (nameList) => formRef.current.getFieldsValue(nameList),
    setFieldsValue: (values) => formRef.current.setFieldsValue(values),
    resetFields: (fields) => {
      formRef.current.resetFields(fields)
      setEditorState(BraftEditor.createEditorState(null))
    }
  }))

  return (
    <SageForm
      ref={formRef}
      formFields={formFields}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  )
}

export default React.forwardRef(CreateForm)
