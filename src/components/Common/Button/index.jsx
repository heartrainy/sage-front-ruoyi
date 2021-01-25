import React from 'react'
import { Button } from 'antd'
import './style.less'


/**
 *
 * @param {success、warning、danger、primary} props
 */
const SageButton = (props) => {
  const componentProps = {
    ...props
  }

  return (
    <Button {...componentProps} className={`sage-button-${componentProps.type} ${componentProps.className ? componentProps.className : ''}`} />
  )
}

export default SageButton
