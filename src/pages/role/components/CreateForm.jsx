import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'

const CreateForm = (props, ref) => {

  const formRef = useRef()

  const onFinish = (values) => {
    if (props.onFinish) {
      props.onFinish(values)
    }
  }

  const onFinishFailed = ({ values }) => {
    console.log(values)
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'roleName',
      label: '角色名',
      type: 'input',
      rules: [{ required: true }]
    },
    {
      name: 'orderNum',
      label: '排序',
      type: 'input',
      rules: [{ required: true }]
    },
    {
      name: 'status',
      label: '状态',
      type: 'switch',
      initialValue: true,
      props: {
        checkedChildren: '启用',
        unCheckedChildren: '禁用'
      }
    }
  ]

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    submit: () => formRef.current.submit(),
    validateFields: (nameList) => formRef.current.validateFields(nameList),
    getFieldsValue: (nameList) => formRef.current.getFieldsValue(nameList),
    setFieldsValue: (values) => formRef.current.setFieldsValue(values),
    resetFields: (fields) => formRef.current.resetFields(fields)
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
