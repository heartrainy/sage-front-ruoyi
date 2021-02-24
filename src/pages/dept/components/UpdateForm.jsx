import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { poInteger, email } from '@/utils/verify'

const UpdateForm = (props, ref) => {

  const { detail, statusOptions, parentIdOptions } = props

  const formRef = useRef()

  useEffect(() => {

  }, [])

  const onFinish = (values) => {
    if (props.onFinish) {
      props.onFinish(values)
    }
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'parentId',
      label: '上级部门',
      type: 'treeselect',
      rules: [
        { required: detail.parentId !== 0 },
      ],
      fieldNames: {title: 'deptName', value: 'deptId'},
      props: {
        treeData: parentIdOptions,
        placeholder: '选择上级部门',
        allowClear: true
      },
      isShow: detail.parentId !== 0
    },
    {
      name: 'deptName',
      label: '部门名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入部门名称'
      }
    },
    {
      name: 'orderNum',
      label: '显示排序',
      type: 'input',
      rules: [
        { required: true },
        { pattern: poInteger, message: '请输入正整数' }
      ],
      props: {
        placeholder: '请输入显示排序'
      }
    },
    {
      name: 'leader',
      label: '负责人',
      type: 'input',
      // rules: [{ required: true }],
      props: {
        placeholder: '请输入负责人',
        maxLength: 20
      }
    },
    {
      name: 'phone',
      label: '联系电话',
      type: 'input',
      // rules: [{ required: true }],
      props: {
        placeholder: '请输入联系电话',
        maxLength: 30
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        { pattern: email, message: '请输入正确的邮箱' }
      ],
      props: {
        placeholder: '请输入邮箱',
      }
    },
    {
      name: 'status',
      label: '部门状态',
      type: 'radio',
      options: statusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
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
      // colNum={2}
      // initialValues={detail}
      onFinish={onFinish}
    />
  )
}

export default React.forwardRef(UpdateForm)
