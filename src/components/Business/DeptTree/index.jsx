import React, { useEffect, useState, useImperativeHandle } from 'react'
import { SageTree } from '@/components/Common'
import { queryDept } from '@/pages/dept/service'

// 遍历所有子节点数组改变结构
function loopTree(arr) {
  arr.forEach(item => {
    item.title = item.orgnName
    item.key = item.id
    if (item.hasSun) {
      item.children = item.children.slice()
      loopTree(item.children)
    }
  })
}

const DeptTree = (props, ref) => {

  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const requestDept = async () => {
    const res = await queryDept()
    const { data } = res
    const treeDataArr = data.slice()
    loopTree(treeDataArr)
    setTreeData(treeDataArr)
    if (treeDataArr.length !== 0) {
      setExpandedKeys([treeDataArr[0].id])
      setAutoExpandParent(false);
    }
  }

  const onExpand = expandedkeys => {
    // console.log('onExpand', expandedkeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedkeys);
    setAutoExpandParent(false);
  };

  const onCheck = checkedkeys => {
    // console.log('onCheck', checkedkeys);
    setCheckedKeys(checkedkeys);
  };

  const onSelect = (selectedkeys, info) => {
    // console.log('onSelect', info);
    setSelectedKeys(selectedkeys);
    if (props.onSelect) {
      props.onSelect(selectedkeys[0])
    }
  };

  const getCheckedKeys = () => {
    return checkedKeys
  }

  const getData = () => {
    return treeData
  }

  useEffect(() => {
    requestDept()
  }, [])

  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    setCheckedKeys,
    getCheckedKeys,
    setSelectedKeys,
    refresh: requestDept,
    getData
  }))

  return (
    <SageTree
      // checkable
      // checkStrictly
      // showLine
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

export default React.forwardRef(DeptTree)
