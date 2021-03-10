import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { SageForm } from '@/components/Common'

const CreateForm = (props, ref) => {

  const { jobStatusOptions, jobGroupOptions } = props

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
      name: 'jobName',
      label: '任务名称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入任务名称',
      }
    },
    {
      type: 'custom',
      render: (
        <Form.Item label="调用方法">
          <Form.Item
            name="invokeTarget"
            noStyle
            rules={[{ required: true, message: '调用方法是必填项!' }]}
          >
            <Input style={{ width: 'calc(100% - 36px)' }} placeholder="请输入调用目标字符串" />
          </Form.Item>
          <Tooltip
            title={
              <>
                Bean调用示例：ryTask.ryParams('ry')
                <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
              </>
            }
          >
            <QuestionCircleOutlined style={{margin: '0 8px'}} />
          </Tooltip>
        </Form.Item>
      )
    },
    {
      name: 'cronExpression',
      label: 'cron表达式',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入cron表达式',
      }
    },
    {
      name: 'jobGroup',
      label: '任务分组',
      type: 'select',
      options: jobGroupOptions,
      valueName: 'dictValue',
      textName: 'dictLabel'
    },
    {
      name: 'concurrent',
      label: '是否并发',
      type: 'radiobutton',
      initialValue: '1',
      options: [
        {value: '0', text: '允许'},
        {value: '1', text: '禁止'}
      ],
    },
    {
      name: 'misfirePolicy',
      label: '错误策略',
      type: 'radiobutton',
      initialValue: '1',
      options: [
        {value: '1', text: '立即执行'},
        {value: '2', text: '执行一次'},
        {value: '3', text: '放弃执行'}
      ],
    },
    {
      name: 'status',
      label: '状态',
      type: 'radiobutton',
      initialValue: '0',
      options: jobStatusOptions,
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
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  )
}

export default React.forwardRef(CreateForm)
