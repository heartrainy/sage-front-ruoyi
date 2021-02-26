import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { poInteger } from '@/utils/verify'
import { handleTree, selectDictLabel } from '@/utils/utils'
import { queryMenu } from '../service'


const UpdateForm = (props, ref) => {
  const [menuType, setMenuType] = useState('0')
  const [parentIdOptions, setParentIdOptions] = useState([])

  const { detail, visibleOptions, statusOptions } = props

  const formRef = useRef()

  // 初始化菜单下拉
  const requestMenuList = async () => {
    const res = await queryMenu()
    if (res.code === 200) {
      const data = res.data.slice()
      const tempData = handleTree(data, 'menuId')
      const initData = [
        {
          value: 0,
          title: '主目录',
          children: tempData
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
      fieldNames: {title: 'menuName', value: 'menuId'},
      props: {
        treeData: parentIdOptions,
        placeholder: '选择上级菜单'
      }
    },
    {
      name: 'menuType',
      label: '菜单类型',
      type: 'radio',
      options: [
        { value: 'M', text: '目录' },
        { value: 'C', text: '菜单' },
        { value: 'F', text: '按钮' }
      ]
    },
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入菜单名称'
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
      name: 'icon',
      label: '图标',
      type: 'input',
      rules: [
        // { required: true },
      ],
      props: {
        placeholder: '请输入图标'
      },
      isShow: menuType !== 'F'
    },
    {
      name: 'isFrame',
      label: '是否外链',
      type: 'radio',
      options: [
        { value: '0', text: '是' },
        { value: '1', text: '否' },
      ],
      isShow: menuType !== 'F'
    },
    {
      name: 'path',
      label: '路由地址',
      type: 'input',
      rules: [{ required: menuType !== 'F' }],
      props: {
        placeholder: '请输入路由地址'
      },
      isShow: menuType !== 'F'
    },
    {
      name: 'component',
      label: '组件路径',
      type: 'input',
      props: {
        placeholder: '请输入组件路径'
      },
      isShow: menuType === 'C'
    },
    {
      name: 'perms',
      label: '权限标识',
      type: 'input',
      props: {
        placeholder: '请输入权限标识'
      },
      isShow: menuType === 'C' || menuType === 'F'
    },
    {
      name: 'visible',
      label: '显示状态',
      type: 'radio',
      options: visibleOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      isShow: menuType !== 'F'
    },
    {
      name: 'status',
      label: '菜单状态',
      type: 'radio',
      options: statusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      isShow: menuType !== 'F'
    },
    {
      name: 'isCache',
      label: '是否缓存',
      type: 'radio',
      options: [
        { value: '0', text: '缓存' },
        { value: '1', text: '不缓存' }
      ],
      isShow: menuType === 'C'
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
      onValuesChange={onValuesChange}
    />
  )
}

export default React.forwardRef(UpdateForm)
