import React, { useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import util from '../../util'
import defaultFieldValue from '../../config/defaultFieldValue'

const formValues = util.deepClone(defaultFieldValue['input'])

const InputForm = (props, ref) => {

  const { 
    fieldValues = formValues
  } = props;

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const onFieldsChange = (changedFields) => {
    props.onFieldsChange(changedFields[0].name[0], changedFields[0].value)
  }

  const onFinish = (values) => {

  }

  useImperativeHandle(ref, () => ({
    getForm: () => form
  }))

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="propsForm"
      onFieldsChange={onFieldsChange}

      onFinish={onFinish}
    >
      <Form.Item
        name="fieldId"
        label="字段名"
        initialValue={fieldValues.fieldId}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="label"
        label="标题"
        initialValue={fieldValues.label}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="placeholder"
        label="占位提示"
        initialValue={fieldValues.placeholder}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="componentWidth"
        label="组件宽度"
        initialValue={fieldValues.componentWidth}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="defaultValue"
        label="默认值"
        initialValue={fieldValues.defaultValue}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="maxLength"
        label="最多输入"
        initialValue={fieldValues.maxLength}
      >
        <Input addonAfter="个字符" />
      </Form.Item>
    </Form>
  )
}

export default React.forwardRef(InputForm)