import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { poInteger, email } from '@/utils/verify'
import { queryDept } from '../service'


const UpdateForm = (props, ref) => {
  const [parentIdOptions, setParentIdOptions] = useState([])

  const { detail } = props

  const formRef = useRef()

  // 初始化菜单下拉
  const requestDeptList = async () => {
    const res = await queryDept()
    if (res.code === 200) {
      const data = res.data.slice()
      setParentIdOptions(data)
    }
  }

  useEffect(() => {
    requestDeptList()
  }, [])

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
      name: 'fatherOrgnId',
      label: '上级部门',
      type: 'treeselect',
      initialValue: 1,
      rules: [
        { required: true },
      ],
      fieldNames: {title: 'orgnName', value: 'id'},
      props: {
        treeData: parentIdOptions
      },
    },
    {
      name: 'orgnName',
      label: '部门名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'orderNum',
      label: '排序',
      type: 'input',
      rules: [
        { required: true },
        { pattern: poInteger, message: '请输入正整数' }
      ],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'leader',
      label: '负责人',
      type: 'input',
      // rules: [{ required: true }],
      props: {
        placeholder: '请输入',
        maxLength: 20
      }
    },
    {
      name: 'phone',
      label: '联系电话',
      type: 'input',
      // rules: [{ required: true }],
      props: {
        placeholder: '请输入',
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
        placeholder: '请输入',
      }
    },
    {
      name: 'status',
      label: '部门状态',
      type: 'switch',
      props: {
        checkedChildren: '启用',
        unCheckedChildren: '禁用'
      }
    },
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
