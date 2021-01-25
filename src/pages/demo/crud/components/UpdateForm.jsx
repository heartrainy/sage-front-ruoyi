import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Form, Input, InputNumber, Select, AutoComplete } from 'antd'
import { SageForm } from '@/components/Common'
import { getEnumDropDownList } from '@/services/enum'

const { Option } = Select

const UpdateForm = (props, ref) => {

  const { detail } = props

  const formRef = useRef()

  // 初始化数据
  const [selectOptions1, setSelectOptions1] = useState([])
  const [selectOptions2, setSelectOptions2] = useState([])

  // 初始化下拉数据
  const initSelectOptions = async () => {
    const res = await getEnumDropDownList({
      code: 'DEVICE_CONTROL_TYPE,DEVICE_FUNCTION_TYPE'
    })
    if (res.isSuccess) {
      const { DEVICE_CONTROL_TYPE = [], DEVICE_FUNCTION_TYPE = [] } = res.data
      DEVICE_CONTROL_TYPE && DEVICE_CONTROL_TYPE.forEach(item => {
        item.text = item.dictValue
        item.value = item.dictKey
      })
      DEVICE_FUNCTION_TYPE && DEVICE_FUNCTION_TYPE.forEach(item => {
        item.text = item.dictValue
        item.value = item.dictKey
      })
      setSelectOptions1(DEVICE_CONTROL_TYPE || [])
      setSelectOptions2(DEVICE_FUNCTION_TYPE || [])
    }
  }

  useEffect(() => {
    // initSelectOptions()
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

  // 获取图片列表
  const getFileList = (list) => {
    const imageList = list ? JSON.parse(list) : []
    const fileList = []
    imageList.forEach(item => {
        const obj = {}
        obj.id = item
        obj.uid = Math.random()
        obj.name = item
        obj.status = 'done'
        obj.url = `/ebd/sys/file/showImage?imageId=${item}`
        fileList.push(obj)
    })
    return fileList
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'field1',
      label: '字段1',
      type: 'text',
      props: {
        value: '字段1的值'
      }
    },
    {
      name: 'field2',
      label: '字段2',
      type: 'input',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field3',
      label: '字段3',     // (固定下拉数据)
      type: 'select',
      rules: [{ required: true }],
      options: [
        { text: '选项1', value: 'select1' },
        { text: '选项2', value: 'select2' }
      ],
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field4',
      label: '字段4',     // (请求下拉数据)
      type: 'select',
      rules: [{ required: true }],
      options: selectOptions1,
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field5',
      label: '字段5',     // (请求下拉数据)
      type: 'select',
      rules: [{ required: true }],
      options: selectOptions2,
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field6',
      label: '字段6',
      type: 'inputnumber',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入',
      }
    },
    {
      name: 'field7',
      type: 'custom',
      render: (
        <Form.Item key="form_key_field7" label="字段7">
          <Form.Item
            name="field7"
            label="字段7"
            noStyle
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
          <span className="sage-form-text"> machines</span>
        </Form.Item>
      )
    },
    {
      name: 'field89',
      type: 'custom',
      render: (
        <Form.Item key="form_key_field89" label="字段8和9">
          <Input.Group compact>
            <Form.Item
              label='field8'
              name={['field89', 'field8']}
              noStyle
              rules={[{ required: true }]}
            >
              <Select style={{ width: '50%' }} placeholder="请选择">
                <Option value="Zhejiang">Zhejiang</Option>
                <Option value="Jiangsu">Jiangsu</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='field9'
              name={['field89', 'field9']}
              noStyle
              rules={[{ required: true }]}
            >
              <Input style={{ width: '50%' }} placeholder="请输入" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      )
    },
    {
      name: 'field1011',
      type: 'custom',
      render: (
        <Form.Item key="form_key_field1011" label="字段10和11" style={{ marginBottom: 0 }}>
          <Form.Item
            name="field10"
            rules={[{ required: true, message: 'field10是必填项!' }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="field11"
            rules={[{ required: true, message: 'field11是必填项!' }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <Input placeholder="请输入" />
          </Form.Item>

        </Form.Item>
      )
    },
    {
      name: 'field12',
      label: '字段12',
      type: 'switch'
    },
    {
      name: 'field13',
      label: '字段13',
      type: 'slider',
      props: {
        marks: {
          0: 'A',
          20: 'B',
          40: 'C',
          60: 'D',
          80: 'E',
          100: 'F',
        }
      }
    },
    {
      name: 'field14',
      label: '字段14',
      type: 'radio',
      options: [
        { value: 'a', text: 'A' },
        { value: 'b', text: 'B' },
        { value: 'c', text: 'C' },
        { value: 'd', text: 'D' }
      ]
    },
    {
      name: 'field15',
      label: '字段15',
      type: 'checkbox',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
        { value: 'd', label: 'D' }
      ]
    },
    {
      name: 'field16',
      label: '字段16',
      type: 'rate'
    },
    {
      name: 'field17',
      label: '字段17',
      type: 'treeselect',
      rules: [{ required: true }],
      props: {
        treeData: [
          { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] }
        ]
      }
    },
    {
      name: 'field18',
      label: '字段18',
      type: 'cascader',
      rules: [{ required: true }],
      props: {
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'West Lake',
                  },
                ],
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  },
                ],
              },
            ],
          },
        ]
      }
    },
    {
      name: 'field19',
      label: '字段19',
      type: 'datepicker',
      rules: [{ required: true }],
      props: {
        style: { width: '100%' }
      }
    },
    {
      name: 'field20',
      label: '字段20',
      type: 'autocomplete',
      rules: [{ required: true }],
      props: {
        placeholder: '请输入',
        options: [
          { value: 'Burns Bay Road' },
          { value: 'Downing Street' },
          { value: 'Wall Street' }
        ]
      }
    },
    {
      name: 'field21',
      label: '字段21',
      type: 'autocomplete',
      rules: [{ required: true }],
      children: (
        <>
          <AutoComplete.Option key="1" value="value1">value1</AutoComplete.Option>
          <AutoComplete.Option key="2" value="value2">value2</AutoComplete.Option>
          <AutoComplete.Option key="3" value="value3">value3</AutoComplete.Option>
        </>
      ),
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field22',
      label: '字段22',
      type: 'datepicker',
      rules: [{ required: true }],
      props: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' }
      }
    },
    {
      name: 'field23',
      label: '字段23',
      type: 'monthpicker',
      rules: [{ required: true }]
    },
    {
      name: 'field24',
      label: '字段24',
      type: 'rangepicker',
      rules: [{ required: true }],
      props: {
        style: { width: '100%' }
      }
    },
    {
      name: 'field25',
      label: '字段25',
      type: 'timepicker',
      rules: [{ required: true }],
      props: {
        style: { width: '100%' }
      }
    },
    {
      name: 'field26',
      label: '字段26',
      type: 'simplepictureupload',
      rules: [{ required: true }],
      props: {
        previewImage: `/ebd/sys/file/showImage?imageId=${detail.field26}`,
        uploadSuccess
      },
    },
    {
      name: 'field27',
      label: '字段27',
      type: 'multiplepictureupload',
      rules: [{ required: true }],
      maxNum: 2,
      props: {
        fileList: getFileList(detail.field27),
        uploadSuccess
      },
    },
    {
      name: 'field28',
      label: '字段28',
      type: 'normalupload',
      maxNum: 2,
      rules: [{ required: true }],
      props: {
        listType: 'picture',
        fileList: getFileList(detail.field28),
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
      formFields={formFields}
      colNum={2}
      // initialValues={detail}
      onFinish={onFinish}
    />
  )
}

export default React.forwardRef(UpdateForm)
