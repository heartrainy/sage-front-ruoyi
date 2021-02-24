import React, { useEffect, useState, useImperativeHandle } from 'react'
import { SageTree } from '@/components/Common'

const MenuTree = (props, ref) => {

  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkStrictly, setCheckStrictly] = useState(true)

  const onExpand = expandedkeys => {
    // console.log('onExpand', expandedkeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedkeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedkeys, e) => {
    // console.log('onCheck', checkedkeys);
    setCheckedKeys(checkedkeys);
    setHalfCheckedKeys(e.halfCheckedKeys)
  };

  const onSelect = (selectedkeys, info) => {
    // console.log('onSelect', info);
    setSelectedKeys(selectedkeys);
  };

  const getCheckedKeys = () => {
    return checkedKeys
  }

  const getHalfCheckedKeys = () => {
    return halfCheckedKeys
  }

  useEffect(() => {

  }, [])

  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    setMenuTree: setTreeData,
    setCheckedKeys,
    getCheckedKeys,
    getHalfCheckedKeys,
    setCheckStrictly
  }))

  return (
    <SageTree
      checkable
      // checkStrictly={checkStrictly}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  )
}

export default React.forwardRef(MenuTree)
