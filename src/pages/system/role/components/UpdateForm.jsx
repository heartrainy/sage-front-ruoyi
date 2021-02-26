import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'

const UpdateForm = (props, ref) => {

  const { detail, statusOptions } = props

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
      rules: [{ required: true }],
      props: {
        placeholder: '请输入角色名',
      }
    },
    {
      name: 'roleKey',
      label: '权限字符',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入权限字符',
      }
    },
    {
      name: 'roleSort',
      label: '角色排序',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入角色排序',
      }
    },
    {
      name: 'status',
      label: '部门状态',
      type: 'radio',
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

export default React.forwardRef(UpdateForm)
