import React, { useState, useImperativeHandle } from 'react';
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
  AutoComplete
} from 'antd'
import { SageButton } from '@/components/Common'
import { DownOutlined, UpOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import './style.less'

const { TextArea } = Input
const { Option } = Select
const { MonthPicker, RangePicker } = DatePicker

const FormComponentType = {
  'input': Input,
  'textarea': TextArea,
  'inputnumber': InputNumber,
  'autocomplete': AutoComplete,
  'select': Select,
  'switch': Switch,
  'slider': Slider,
  'radio': Radio,
  'checkbox': Checkbox,
  'rate': Rate,
  'treeselect': TreeSelect,
  'cascader': Cascader,
  'datepicker': DatePicker,
  'monthpicker': MonthPicker,
  'rangepicker': RangePicker,
  'timepicker': TimePicker,
  'custom': 'Custom'  // 自定义
}

const defaultExpandNum = 5

/**
 * 1、expandNum 大于多少个可展开默认5
 * 2、searchFields []
 * name: 字段名
 * label: 名称
 * type: 类型
 * props: {}
 */
const TableSearchForm = React.forwardRef((props, ref) => {
  const [expand, setExpand] = useState(false)
  const [hidden, setHidden] = useState(false)
  const expandNum = props.expandNum ? props.expandNum : defaultExpandNum
  const searchFields = props.searchFields ? props.searchFields : []
  const [form] = Form.useForm();

  const getFields = () => {
    return searchFields.map((item, index) => {
      const FormComponent = FormComponentType[item.type]

      if (item.type === 'custom') {
        return item.render
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

      switch (item.type) {
        case 'select':
          formCompnentNode = (
            <FormComponent {...item.props}>
              {
                item.options.map((item2, index2) => {
                  return (
                    <Option value={item2.value} key={item2.value}>{item2.text}</Option>
                  )
                })
              }
            </FormComponent>
          )
          break;
        case 'radio':
          formCompnentNode = (
            <FormComponent.Group {...item.props}>
              {
                item.options.map((item2, index2) => {
                  return (
                    <FormComponent value={item2.value} key={item2.value}>{item2.text}</FormComponent>
                  )
                })
              }
            </FormComponent.Group>
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
        default:
          formCompnentNode = <FormComponent {...item.props} />
          break;
      }

      return (
        <Col span={8} key={`search_form_key_${item.name}`} className={(index > expandNum - 1 && !expand) ? 'sage-hidden' : ''}>
          <Form.Item
            {...formItemProps}
          >
            {formCompnentNode}
          </Form.Item>
        </Col>
      )
    })
  };

  const onFinish = values => {
    props.onSearchTable(values);
  };

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    hiddenSearch: () => {
      setHidden(!hidden)
    },
    getFieldsValue: (nameList) => form.getFieldsValue(nameList),
    setFieldsValue: (values) => form.setFieldsValue(values),
  }))

  return (
    <Form
      form={form}
      // name="advanced_search"
      className={`sage-table-search-form ${hidden ? 'sage-hidden' : ''}`}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        {getFields()}
        <Col span={(!expand && searchFields.length > expandNum ) ? 8 * (3 - expandNum % 3) : 8 * (3 - searchFields.length % 3)} style={{ textAlign: 'right' }}>
          <SageButton type="success" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </SageButton>
          <SageButton
            type="warning"
            icon={<ReloadOutlined />}
            style={{ margin: '0 8px' }}
            onClick={() => {
              form.resetFields()
              props.onResetTable()
            }}
          >
            重置
          </SageButton>
          {
            searchFields.length > expandNum ?
              <a
                style={{ fontSize: 14 }}
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? <>收起 <UpOutlined /></> : <>展开 <DownOutlined /></>}
              </a> : null
          }
        </Col>
      </Row>
    </Form>
  );
});

export default TableSearchForm
