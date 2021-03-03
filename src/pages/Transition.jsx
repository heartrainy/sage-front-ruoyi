// 过渡页
import React, { useEffect } from 'react';
import { history } from 'umi'

function Transition(props) {
  
  const { location: { query : { path, ...otherParams }} } = props

  useEffect(() => {
    if (Object.keys(otherParams).length !== 0) {
      history.replace({
        pathname: path,
        query: {
          ...otherParams
        }
      })
    } else {
      history.replace(path)
    }
  }, [])

  return (
    <>
      
    </>
  );
}

export default Transition;
