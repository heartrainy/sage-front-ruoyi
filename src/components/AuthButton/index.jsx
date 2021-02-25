import React from 'react';
import { connect } from 'umi'
import SageButton from '../Common/Button'

function AuthButton(props) {
  const { auth = '*:*:*', user: { permissions }, dispatch, ...otherProps } = props

  let isExist = true
  if (auth !== '*:*:*') {
    isExist = permissions.some(item => item === auth)
  }

  console.log(auth)
  return (
    <>
      {
        isExist ? <SageButton {...otherProps}></SageButton> : null
      }
    </>
  );
}

export default connect(({ user }) => ({ user }))(AuthButton)
