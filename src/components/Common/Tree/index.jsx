import React, { useState, useEffect } from 'react'
import { Tree } from 'antd'

const SageTree = (props) => {
  const {
    request,
    treeData: treeDataProps,
    ...treeProps
  } = props

  const [treeData, setTreeData] = useState([])

  const queryTree = async () => {
    if (request) {
      const res = await request()
    }
  }

  useEffect(() => {
    queryTree()
  }, [])

  const treeDataState = treeDataProps !== undefined ? treeDataProps : treeData

  return(
    <Tree
      treeData={treeDataState}
      {...treeProps}
    />
  )
}

export default SageTree
