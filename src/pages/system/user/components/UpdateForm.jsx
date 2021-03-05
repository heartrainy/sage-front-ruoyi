import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { mobile, email, idCode } from '@/utils/verify'
import { getTreeSelect } from '@/pages/system/dept/service'
import { getPostsAndRoles } from '../service'

// 遍历所有子节点数组改变结构
function loopTree(arr) {
  arr.forEach(item => {
    item.title = item.label
    item.key = item.id
    item.value = item.id
    if (item.children && item.children.length !== 0) {
      loopTree(item.children)
    }
  })
}

const UpdateForm = (props, ref) => {
  const { detail } = props

  const [deptTree, setDeptTree] = useState([])

  const { userSexOptions, statusOptions, postOptions, roleOptions } = props

  const formRef = useRef()

  // 初始化组织部门下拉
  const requestDeptTree = async () => {
    const res = await getTreeSelect()
    const { data } = res
    const treeDataArr = data.slice()
    loopTree(treeDataArr)
    setDeptTree(treeDataArr)
  }

  useEffect(() => {
    requestDeptTree()
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
      name: 'nickName',
      label: '用户昵称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入用户昵称'
      }
    },
    {
      name: 'deptId',
      label: '归属部门',
      type: 'treeselect',
      // rules: [{ required: true }],
      // fieldNames: { title: 'orgnName', value: 'id' },
      props: {
        treeData: deptTree
      }
    },
    {
      name: 'phonenumber',
      label: '手机号吗',
      type: 'input',
      rules: [
        // { required: true },
        { pattern: mobile, message: '请输入正确的手机号码' }
      ],
      props: {
        placeholder: '请输入手机号码'
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        // { required: true },
        { pattern: email, message: '请输入正确的邮箱' }
      ]
    },
    // {
    //   name: 'userName',
    //   label: '用户名',
    //   type: 'input',
    //   rules: [
    //     { required: true }
    //   ],
    //   props: {
    //     placeholder: '请输入用户名'
    //   }
    // },
    // {
    //   name: 'password',
    //   label: '用户密码',
    //   type: 'input',
    //   rules: [
    //     { required: true }
    //   ],
    //   initialValue: '123456',
    //   props: {
    //     type: 'password',
    //     placeholder: '请输入用户密码'
    //   }
    // },
    {
      name: 'sex',
      label: '性别',
      type: 'select',
      options: userSexOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '请选择性别'
      }
    },
    {
      name: 'status',
      label: '状态',
      type: 'radio',
      options: statusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
    },
    {
      name: 'postIds',
      label: '岗位',
      type: 'select',
      options: postOptions,
      valueName: 'postId',
      textName: 'postName',
      props: {
        mode: 'multiple',
        placeholder: '请选择岗位'
      }
    },
    {
      name: 'roleIds',
      label: '角色',
      type: 'select',
      options: roleOptions,
      valueName: 'roleId',
      textName: 'roleName',
      props: {
        mode: 'multiple',
        placeholder: '请选择角色'
      }
    },
    {
      name: 'remark',
      label: '备注',
      span: 24,
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      type: 'textarea',
      // rules: [{ required: true }],
      props: {
        style: { width: '100%' }
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
      colNum={2}
      labelCol={ {span: 6 }}
      wrapperCol={ {span: 18} }
      formFields={formFields}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  )
}

export default React.forwardRef(UpdateForm)
