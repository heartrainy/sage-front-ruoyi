import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { getEnumDropDownList } from '@/services/enum'

const { Option } = Select

const CreateForm = (props, ref) => {

  const formRef = useRef()

  useEffect(() => {

  }, [])

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
      name: 'field1',
      label: '商户logo',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field2',
      label: '商户名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field3',
      label: '商户简称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field4',
      label: '商户分类',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
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
