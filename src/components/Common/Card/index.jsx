import React from 'react'
import { Card } from 'antd'
import './style.less'

/**
 *
 * @param props
 */
const SageCard = (props) => {
  const componentProps = {
    ...props
  }

  return (
    <Card {...componentProps} />
  )
}

export default SageCard
