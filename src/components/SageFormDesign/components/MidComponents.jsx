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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from '../style.less'
import { useHover } from '@umijs/hooks';

// 样式相关 代码
const grid = 8;

const validateMessages = {
  required: '${label}是必填项!'
};

const { TextArea } = Input

const MidComponents = (props, ref) => {
  const { board, items } = props

  const [form] = Form.useForm();

  const onFieldsChange = (changedFields) => {
    const fieldId = changedFields[0].name[0]
    const fieldValue = changedFields[0].value
    props.onChangeComponentForm(fieldId, fieldValue)
  }

  // 点击组件
  const changeBoard = (id) => {
    props.changeBoard(id)
  }

  // 水平样式
  const getItemStyle = (isDragging, boardId, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    padding: '12px 10px 0',
    borderRadius: '6px',
    outline: 'none',

    // change background colour if dragging
    background: (isDragging || boardId === board.id) ? '#f6f7ff' : '#FFFFFF',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  useImperativeHandle(ref, () => ({
    getForm: () => form
  }))

  return (
    <Droppable
      droppableId="droppable-board"
      // type="board"
      direction="vertical"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.centorboardrow}
          // style={getBoardStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          <div style={{ paddingTop: '10px' }}>
            <Form
              // {...layout}
              form={form}
              validateMessages={validateMessages}
              // {...formProps}
              className="sage-editor-form"
              labelAlign="right"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              onFieldsChange={onFieldsChange}
            >
              <Row span={24}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => {
                      const { config } = item

                      let formCompnentNode = null
                      const style = config.componentWidth ? { width: config.componentWidth } : {}
                      switch (item.type) {
                        case 'input':
                          formCompnentNode = (
                            <Input
                              placeholder={config.placeholder}
                              style={style}
                              maxLength={config.maxLength}
                              allowClear={config.clearable}
                              readOnly={config.readonly}
                              disabled={config.disabled}
                            >
                            </Input>
                          )
                          break;
                        case 'textarea':
                          formCompnentNode = (
                            <TextArea
                              placeholder={config.placeholder}
                              style={style}
                              maxLength={config.maxLength}
                              autoSize={{ minRows: config.minRows, maxRows: config.maxRows }}
                              allowClear={config.clearable}
                              readOnly={config.readonly}
                              disabled={config.disabled}
                            >
                            </TextArea>
                          )
                          break;
                        case 'password':
                          formCompnentNode = (
                            <Input.Password
                              placeholder={config.placeholder}
                              style={style}
                              maxLength={config.maxLength}
                              autoSize={{ minRows: config.minRows, maxRows: config.maxRows }}
                              allowClear={config.clearable}
                              readOnly={config.readonly}
                              disabled={config.disabled}
                            >
                            </Input.Password>
                          )
                          break;
                        case 'number':
                          formCompnentNode = (
                            <InputNumber
                              defaultValue={config.defaultValue}
                              placeholder={config.placeholder}
                              style={style}
                              min={config.min}
                              max={config.max}
                              step={config.step}
                              precision={config.precision}
                              readOnly={config.readonly}
                              disabled={config.disabled}
                            >
                            </InputNumber>
                          )
                          break;
                        default:
                          break;
                      }

                      return (
                        <Col
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          span={24}
                          className={styles.boardcol}
                          style={getItemStyle(
                            snapshot.isDragging,
                            item.id,
                            provided.draggableProps.style
                          )}
                          onClick={() => changeBoard(item.id)}
                        >
                          <Form.Item
                            label={config.label}
                            name={config.fieldId}
                            initialValue={config.defaultValue}
                          >
                            {formCompnentNode}
                          </Form.Item>
                        </Col>
                        // <div
                        //   ref={provided.innerRef}
                        //   {...provided.draggableProps}
                        //   {...provided.dragHandleProps}
                        //   style={getItemStyle(
                        //     snapshot.isDragging,
                        //     provided.draggableProps.style
                        //   )}
                        // >

                        // </div>
                      )
                    }}
                  </Draggable>
                ))}
              </Row>
            </Form>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>


  )
}

export default React.forwardRef(MidComponents)