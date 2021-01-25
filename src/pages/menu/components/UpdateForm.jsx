import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { poInteger } from '@/utils/verify'
import { queryMenu } from '../service'


const UpdateForm = (props, ref) => {
  const [menuType, setMenuType] = useState('0')
  const [parentIdOptions, setParentIdOptions] = useState([])

  const { detail } = props

  const formRef = useRef()

  // 初始化菜单下拉
  const requestMenuList = async () => {
    const res = await queryMenu()
    if (res.isSuccess) {
      const data = res.data.slice()
      const initData = [
        {
          value: 0,
          title: '主目录',
          children: data
        }
      ]
      setParentIdOptions(initData)
    }
  }

  useEffect(() => {
    requestMenuList()
  }, [])

  useEffect(() => {
    setMenuType(detail.menuType)
  }, [detail])

  const onFinish = (values) => {
    if (props.onFinish) {
      props.onFinish(values)
    }
  }

  const onValuesChange = (changedValues) => {
    if (Object.keys(changedValues)[0] === 'menuType') {
      setMenuType(changedValues.menuType)
    }
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'parentId',
      label: '上级菜单',
      type: 'treeselect',
      fieldNames: {title: 'menuName', value: 'id'},
      props: {
        treeData: parentIdOptions
      }
    },
    {
      name: 'menuType',
      label: '菜单类型',
      type: 'radio',
      options: [
        { value: '0', text: '目录' },
        { value: '1', text: '菜单' },
        { value: '2', text: '按钮' }
      ]
    },
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'url',
      label: menuType === '0' || menuType === '1' ? '路由地址' : '请求地址',
      type: 'input',
      props: {
        placeholder: '请输入'
      },
    },
    {
      name: 'target',
      label: '打开方式',
      type: 'radio',
      options: [
        { value: '1', text: '页签' },
        { value: '0', text: '新窗口' },
      ],
      isShow: menuType === '1'
    },
    {
      name: 'perms',
      label: '权限标识',
      type: 'input',
      props: {
        placeholder: '请输入'
      },
      isShow: menuType === '1' || menuType === '2'
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
      name: 'icon',
      label: '图标',
      type: 'input',
      rules: [
        // { required: true },
      ],
      props: {
        placeholder: '请输入'
      },
      isShow: menuType === '0' || menuType === '1'
    },
    {
      name: 'status',
      label: '菜单可见',
      type: 'radio',
      options: [
        { value: '1', text: '显示' },
        { value: '0', text: '隐藏' },
      ],
      isShow: menuType === '0' || menuType === '1'
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
      onValuesChange={onValuesChange}
    />
  )
}

export default React.forwardRef(UpdateForm)
