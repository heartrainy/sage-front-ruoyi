import React from 'react';
import { connect } from 'umi'
import SageButton from '../Common/Button'

function AuthButton(props) {
  const { auth = '*:*:*', user: { permissions }, dispatch, ...otherProps } = props
  
  let isExist = true
  if (auth !== '*:*:*') {
    isExist = permissions.some(item => item === auth)
  }

  // 如果是超级管理员
  if (permissions.length === 1 && permissions[0] === '*:*:*') {
    isExist = true
  }
  
  return (
    <>
      {
        isExist ? <SageButton {...otherProps}></SageButton> : null
      }
    </>
  );
}

export default connect(({ user }) => ({ user }))(AuthButton)
