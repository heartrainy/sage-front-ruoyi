import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'

const CreateForm = (props, ref) => {

  const { statusOptions } = props

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
      name: 'dictName',
      label: '字典名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入字典名称',
      }
    },
    {
      name: 'dictType',
      label: '字典类型',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入字典类型',
      }
    },
    {
      name: 'status',
      label: '状态',
      type: 'radio',
      initialValue: '0',
      options: statusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      props: {
        placeholder: '请输入内容',
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
