import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { mobile, email, idCode } from '@/utils/verify'
import { queryDept } from '@/pages/dept/service'
import { queryRole } from '@/pages/role/service'

const UpdateForm = (props, ref) => {
  const { detail } = props

  const [orgnIdOptions, setOrgnIdOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])

  const formRef = useRef()

  // 初始化菜单下拉
  const requestDeptList = async () => {
    const res = await queryDept()
    if (res.code === 200) {
      const data = res.data.slice()
      setOrgnIdOptions(data)
    }
  }

  // 初始化角色数组
  const requestRoleList = async () => {
    const res = await queryRole({pageNum: 1, pageSize: 100})
    if (res.code === 200) {
      const data = res.data.slice()
      data.forEach(item => {
        item.label = item.roleName;
        item.value = item.id.toString();
      })
      setRoleOptions(data)
    }
  }

  useEffect(() => {
    requestDeptList()
    requestRoleList()
  }, [])

  // 上传成功
  const uploadSuccess = (field, value) => {
    formRef.current.setFieldsValue({ [field]: value })
  }

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
      name: 'personName',
      label: '用户名',
      type: 'input',
      rules: [{ required: true }]
    },
    {
      name: 'sex',
      label: '性别',
      type: 'radio',
      options: [
        { value: '1', text: '男' },
        { value: '0', text: '女' },
      ]
    },
    {
      name: 'idNo',
      label: '身份证号',
      type: 'input',
      rules: [{ pattern: idCode, message: '请输入正确的身份证号' }]
    },
    {
      name: 'personNo',
      label: '员工号',
      type: 'input',
      // rules: [{ required: true }]
    },
    {
      name: 'entryTime',
      label: '入职时间',
      type: 'datepicker',
      // rules: [{ required: true }],
      props: {
        style: { width: '100%' }
      }
    },
    {
      name: 'orgnId',
      label: '归属部门',
      type: 'treeselect',
      // rules: [{ required: true }],
      fieldNames: { title: 'orgnName', value: 'id' },
      props: {
        treeData: orgnIdOptions
      },
    },
    {
      name: 'mobile',
      label: '手机号',
      type: 'input',
      rules: [
        { required: true },
        { pattern: mobile, message: '请输入正确的手机号' }
      ]
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
    {
      name: 'roleIds',
      label: '角色',
      type: 'checkbox',
      span: 24,
      labelCol: {span: 3},
      options: roleOptions
    },
    {
      name: 'status',
      label: '状态',
      type: 'switch',
      props: {
        checkedChildren: '启用',
        unCheckedChildren: '禁用'
      }
    },
    {
      name: 'headImage',
      label: '头像',
      span: 24,
      labelCol: {span: 3},
      type: 'simplepictureupload',
      // rules: [{ required: true }],
      props: {
        previewImage: detail.headImage ? `/ebd/sys/file/showImage?imageId=${detail.headImage}` : '',
        uploadSuccess
      },
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
