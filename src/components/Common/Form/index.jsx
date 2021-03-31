import React, { useImperativeHandle } from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Rate,
  TreeSelect,
  Cascader,
  DatePicker,
  TimePicker,
  AutoComplete,
  Upload,
  Button
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import SimplePictureUpload from '../Upload/SimplePictureUpload'
import MultiplePictureUpload from '../Upload/MultiplePictureUpload'
import NormalUpload from '../Upload/NormalUpload'
// import { removeChildren } from '@/utils/utils'

import './style.less'

const { TextArea } = Input
const { Option } = Select
const { MonthPicker, RangePicker } = DatePicker

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const validateMessages = {
  required: '${label}是必填项!'
};

// 展示属性
const TextField = (props) => {
  return (
    <span className="sage-form-text">{props.value}</span>
  )
}

const normFile = e => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

const FormComponentType = {
  'text': TextField,
  'input': Input,
  'textarea': TextArea,
  'inputnumber': InputNumber,
  'autocomplete': AutoComplete,
  'select': Select,
  'switch': Switch,
  'slider': Slider,
  'radio': Radio,
  'radiobutton': Radio.Button,
  'checkbox': Checkbox,
  'rate': Rate,
  'treeselect': TreeSelect,
  'cascader': Cascader,
  'datepicker': DatePicker,
  'monthpicker': MonthPicker,
  'rangepicker': RangePicker,
  'timepicker': TimePicker,
  'simplepictureupload': SimplePictureUpload,
  'multiplepictureupload': MultiplePictureUpload,
  'normalupload': NormalUpload,
  'custom': 'Custom'  // 自定义
}

/**
 *
 * @param {*} props
 * 1、formFields 字段集
 */
const SageForm = (props, ref) => {
  const {
    formFields,
    colNum = 1,
    showButtonRow = false,           // 是否显示按钮行
    showSubmitButton = false,     // 是否显示提交按钮
    showReturnButton = false,     // 是否显示取消按钮
    submitText = '提交',
    returnText = '返回',
    onReturn,
    tailLayout = {
      wrapperCol: { offset: 4, span: 20 }
    },
    ...formProps
  } = props

  const [form] = Form.useForm();

  // const onReturn = () => {
  //   if (props.onReturn) {
  //     props.onReturn()
  //   }
  // }

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
    validateFields: (nameList) => form.validateFields(nameList),
    getFieldValue: (name) => form.getFieldValue(name),
    getFieldsValue: (nameList) => form.getFieldsValue(nameList),
    setFieldsValue: (values) => form.setFieldsValue(values),
    resetFields: (fields) => form.resetFields(fields),
    scrollToField: (name, options) => form.scrollToField(name, options)
  }))

  let formNode = null
  formNode = formFields.map((item, index) => {

    const { isShow = true } = item
    // if (!isShow) return null

    const FormComponent = FormComponentType[item.type]

    if (item.type === 'custom') {
      return (
        <Col key={`col_key_${item.name}`} span={24 / colNum}>
          {item.render}
        </Col>
      )
    }

    let formCompnentNode = null

    const formItemProps = {
      key: `form_key_${item.name}`,
      label: item.label,
    }

    if (item.type !== 'text') {
      formItemProps.name = item.name
      formItemProps.rules = item.rules ? item.rules : []
    }
    if (item.type === 'switch') {
      formItemProps.valuePropName = 'checked'
    }

    if (item.initialValue) {
      formItemProps.initialValue = item.initialValue
    }

    if (item.labelCol) {
      formItemProps.labelCol = item.labelCol
    }

    if (item.wrapperCol) {
      formItemProps.wrapperCol = item.wrapperCol
    }

    if (item.dependencies) {
      formItemProps.dependencies = item.dependencies
    }

    const { valueName = 'value', textName = 'text' } = item
    switch (item.type) {
      case 'select':
        formCompnentNode = (
          <FormComponent {...item.props}>
            {
              item.options.map((item2, index2) => {
                return (
                  <Option value={item2[valueName]} key={item2[valueName]} disabled={item2.disabled}>{item2[textName]}</Option>
                )
              })
            }
          </FormComponent>
        )
        break;
      case 'radio':
        formCompnentNode = (
          <Radio.Group {...item.props}>
            {
              item.options.map((item2, index2) => {
                return (
                  <FormComponent value={item2[valueName]} key={item2[valueName]}>{item2[textName]}</FormComponent>
                )
              })
            }
          </Radio.Group>
        )
        break;
      case 'radiobutton':
        formCompnentNode = (
          <Radio.Group {...item.props}>
            {
              item.options.map((item2, index2) => {
                return (
                  <FormComponent value={item2[valueName]} key={item2[valueName]}>{item2[textName]}</FormComponent>
                )
              })
            }
          </Radio.Group>
        )
        break;
      case 'checkbox':
        formCompnentNode = <FormComponent.Group options={item.options} {...item.props} />
        break;
      case 'autocomplete':
        if (item.children) {
          formCompnentNode = <FormComponent {...item.props}>{item.children}</FormComponent>
        } else {
          formCompnentNode = <FormComponent {...item.props} />
        }
        break;
      case 'treeselect':
        if (item.fieldNames) {
          const { treeData = [], ...otherProps } = item.props
          const loopCheckTreeData = list => {
            list.forEach(treeItem => {
              if (item.fieldNames.title && treeItem[item.fieldNames.title]) {
                treeItem.title = treeItem[item.fieldNames.title]
                // delete treeItem[item.fieldNames.value]
              }
              if (item.fieldNames.value && treeItem[item.fieldNames.value]) {
                treeItem.value = treeItem[item.fieldNames.value]
                // delete treeItem[item.fieldNames.value]
              }
              if (treeItem.children) {
                loopCheckTreeData(treeItem.children)
              }
            })
          }
          loopCheckTreeData(treeData)
          formCompnentNode = <FormComponent {...otherProps} treeData={treeData} />
        } else {
          formCompnentNode = <FormComponent {...item.props} />
        }
        break;
      case 'simplepictureupload':
        formCompnentNode = <FormComponent {...item} />
        break;
      case 'multiplepictureupload':
        formCompnentNode = <FormComponent {...item} />
        break;
      case 'normalupload':
        formCompnentNode = <FormComponent {...item} />
        break;
      default:
        formCompnentNode = <FormComponent {...item.props} />
        break;
    }

    return (
      <Col className={!isShow ? 'sage-hidden' : ''} key={`col_key_${item.name}`} span={item.span || (24 / colNum)}>
        <Form.Item
          {...formItemProps}
        >
          {formCompnentNode}
        </Form.Item>
      </Col>
    )
  })

  return (
    <Form
      {...layout}
      form={form}
      // name="basic"
      // initialValues={{ remember: true }}
      validateMessages={validateMessages}
      {...formProps}
      className="sage-form"
    >
      <Row span={24}>
        {formNode}
      </Row>
      {
        showButtonRow ?
          <Row span={24}>
            <Col span={24}>
              <Form.Item {...tailLayout}>
                {
                  showSubmitButton ?
                    <Button type="primary" htmlType="submit" className="sage-form-buttn">
                      {submitText}
                    </Button> : null
                }
                {
                  showReturnButton ?
                    <Button htmlType="button" onClick={() => onReturn && onReturn()} className="sage-form-buttn">
                      {returnText}
                    </Button> : null
                }
              </Form.Item>
            </Col>
          </Row> : null
      }
    </Form>
  )
}

export default React.forwardRef(SageForm)
