import React from 'react'
import './style.less'

const SageLayoutLR = (props) => {

  const {left, right, leftWidth, rightWidth} = props

  return (
    <div className="sage-layout-lr">
      <div className="sage-layout-left" style={leftWidth ? {"flex": `0 0 ${leftWidth}px`} : {}}>{left}</div>
      <div className="sage-layout-right" style={rightWidth ? {"flex": `0 0 ${rightWidth}px`} : {}}>{right}</div>
    </div>
  )
}

export default SageLayoutLR
