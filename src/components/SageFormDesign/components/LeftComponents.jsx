import React, { useState } from 'react'
import { createFromIconfontCN } from '@ant-design/icons';
import { Droppable, Draggable } from "react-beautiful-dnd";
import styles from '../style.less'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2351139_fhn4kx6vwdb.js',
});

const DragComponent = (props) => {
  const { id, label, dragIndex, icon } = props;

  return (
    <Draggable draggableId={id} index={dragIndex}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.componentsitem}
          // className={snapshot.isDragging ? styles.issueDragging : styles.issue}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.componentsbody}>
            <IconFont type={icon} style={{ fontSize: '16px' }} />
            <span className={styles.componentstext}>{label}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const LeftComponents = (props) => {

  const [inputComponents, setInputComponents] = useState(props.items)

  return (
    <Droppable droppableId="droppable-components" isDropDisabled={true}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={styles.componentsdraggable}
          {...provided.droppableProps}
        >
          {inputComponents.map((item, index) => (
            <DragComponent 
              id={item.id} 
              label={item.label} 
              key={item.id} 
              dragIndex={index} 
              icon={item.icon}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default LeftComponents