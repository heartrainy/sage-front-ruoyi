import React, { useState, useRef } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LeftComponents from './components/LeftComponents';
import MidComponents from './components/MidComponents';
import RightComponents from './components/RightComponents';
import defaultFieldValue from './config/defaultFieldValue';
import util from './util'
import styles from './style.less'

const getBoardStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // display: 'flex',
  // padding: grid,
  // overflow: 'auto',
});

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2351139_fhn4kx6vwdb.js',
});

const SageFormDesign = () => {


  const [seeds, setSeeds] = useState([
    {
      id: 'component-input',
      type: 'input',
      label: '单行文本',
      icon: 'icon-input'
    },
    {
      id: 'component-textarea',
      type: 'textarea',
      label: '多行文本',
      icon: 'icon-textarea'
    },
    {
      id: 'component-password',
      type: 'password',
      label: '密码',
      icon: 'icon-password'
    },
    {
      id: 'component-number',
      type: 'number',
      label: '计数器',
      icon: 'icon-number'
    },
    {
      id: 'component-rich-text',
      type: 'rich-text',
      label: '编辑器',
      icon: 'icon-rich-text'
    }
  ])
  const [boards, setBoards] = useState([
    // { id: 'board-1', content: '1'}
  ])
  const [activeBoard, setActiveBoard] = useState({})

  const midRef = useRef()
  const rightRef = useRef()

  // 右侧修改组件属性值
  const onChangeBoard = (id, name, value) => {
    const new_boards = util.deepClone(boards)
    for (let i = 0; i < new_boards.length; i++) {
      if (new_boards[i].id === id) {
        new_boards[i].config[name] = value
        // 修改中间编辑表单的默认值
        if (name === 'defaultValue' && midRef.current) {
          const midForm = midRef.current.getForm()
          midForm.setFieldsValue({
            [new_boards[i].config.fieldId]: value
          })
        }
        break;
      }
    }
    setBoards(new_boards)
  }

  // 修改编辑区默认值同步到组件属性
  const onChangeComponentForm = (fieldId, fieldValue) => {
    const new_boards = util.deepClone(boards)
    for (let i = 0; i < new_boards.length; i++) {
      if (new_boards[i].config.fieldId === fieldId) {
        new_boards[i].config.defaultValue = fieldValue
        break;
      }
    }
    setBoards(new_boards)

    // 当前右侧组件属性表单正好是编辑区修改的组件
    if (activeBoard.config.fieldId === fieldId && (activeBoard.type === 'input' || activeBoard.type === 'textarea')) {
      for (let i = 0; i < new_boards.length; i++) {
        if (new_boards[i].config.fieldId === fieldId) {
          if (rightRef.current) {
            const rightForm = rightRef.current.getForm()
            rightForm.setFieldsValue({
              defaultValue: fieldValue
            })
          }
          // const newActiveBoard = util.deepClone(new_boards[i])
          // setActiveBoard(newActiveBoard)
          break;
        }
      }
    }

    // const newActiveBoard = util.deepClone(activeBoard)
    // console.log(newActiveBoard)
    // console.log(new_boards)
    // setActiveBoard(newActiveBoard)
    // if (name === activeBoard.config.fieldId) 
    // console.log(name) 
    // console.log(value)
    // console.log(activeBoard)
  }

  // 中间点击组件修改右侧组件属性
  const changeBoard = (id) => {
    const new_boards = util.deepClone(boards)
    for (let i = 0; i < new_boards.length; i++) {
      if (new_boards[i].id === id) {
        const newActiveBoard = util.deepClone(new_boards[i])
        // 如果是同类型组件则修改表单值
        if (newActiveBoard.type === activeBoard.type) {
          if (rightRef.current) {
            const rightForm = rightRef.current.getForm()
            rightForm.setFieldsValue({
              ...newActiveBoard.config
            })
          }
        }
        setActiveBoard(newActiveBoard)
        break
      }
    }
  }

  // 拖拽结束
  const onDragEnd = (result) => {
    console.log(result)
    // dropped outside the list
    const { destination, source, draggableId } = result

    // 深拷贝对象数组
    const new_seeds = util.deepClone(seeds)
    const new_boards = util.deepClone(boards)

    let start
    if (source.droppableId.indexOf('droppable-components') !== -1) {
      start = new_seeds[source.index]
    }
    if (source.droppableId.indexOf('droppable-board') !== -1) {
      start = new_boards[source.index]
    }

    if (!destination) { // 表单原先为空
      return
    } else {
      if (destination.droppableId.indexOf('droppable-components') !== -1) return // 任何地方拖放到菜单，不处理

      const finish = new_boards[destination.index] // 结束地必是表单面板
      const startIndex = source.index
      const finishIndex = destination.index
      console.warn('startIndex', startIndex)
      console.warn('finishIndex', finishIndex)

      if (finish && start.id === finish.id) return // 无拖动

      if (source.droppableId.indexOf('droppable-board') !== -1) {// 起点在表单面板
        new_boards.splice(startIndex, 1)
        new_boards.splice(finishIndex, 0, start)
      } else if (source.droppableId.indexOf('droppable-components') !== -1) {// 起点在菜单
        const dragComponentType = draggableId.substr('components'.length)
        start.id = `board-${new_boards.length}`
        start.type = dragComponentType
        start.config = util.deepClone(defaultFieldValue[dragComponentType])
        start.config.fieldId = `field_${new Date().getTime()}`
        new_boards.splice(finishIndex, 0, start)
        // 如果是同类型则修改右侧表单值
        if (start.type === activeBoard.type) {
          if (rightRef.current) {
            const rightForm = rightRef.current.getForm()
            rightForm.setFieldsValue({
              ...start.config
            })
          }
        }
        setActiveBoard(start)
      }
    }

    setBoards(new_boards)
  }

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.leftboard}>
          <div className={styles.logowrapper}></div>
          <div className={styles.leftscrollbar}>
            <div className={styles.componentslist}>
              <div>
                <div className={styles.componentstitle}>
                  <IconFont type="icon-component" style={{ fontSize: '16px', marginRight: '4px' }} />
                  <span>输入型组件</span>
                </div>
                <LeftComponents items={seeds} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.centerboard}>
          <div className={styles.actionbar}></div>
          <div className={styles.centerscrollbar}>
            {/* <div className={styles.centorboardrow}> */}
            <MidComponents ref={midRef} board={activeBoard} items={boards} onChangeComponentForm={onChangeComponentForm} changeBoard={changeBoard} />
            {/* </div> */}
          </div>
        </div>
      </DragDropContext>
      <div className={styles.rightboard}>
        <RightComponents ref={rightRef} board={activeBoard} items={boards} onChangeBoard={onChangeBoard} />
      </div>
    </div>
  )
}

export default SageFormDesign