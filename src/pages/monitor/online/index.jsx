import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import moment from 'moment'
import { SageTable, SageMessage, ActionSet } from '@/components/Common'
import { queryOnline, removeOnline } from './service';
import { addDateRange } from '@/utils/utils';

const { confirm } = Modal

const initDetail = {
  id: null
}

const TableList = (props) => {

  // 状态
  const [detail, setDetail] = useState(initDetail) // 详情
  const [status, setStatus] = useState('') // 状态 1、add 2、update 3、detail
  const [modalLoading, setModalLoading] = useState(false) // 窗口loading
  const [commonStatusOptions, setCommonStatusOptions] = useState([])  //  登录状态Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用


  useEffect(() => {
    
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'ipaddr',
      label: '登录地址',
      type: 'input',
      props: {
        placeholder: '请输入登录地址',
        allowClear: true
      }
    },
    {
      name: 'userName',
      label: '用户名称',
      type: 'input',
      props: {
        placeholder: '请输入用户名称',
        allowClear: true
      }
    }
  ]

  // 查询
  const onSearchTable = (params) => {
    if (tableRef.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件

      tableRef.current.queryTable(addDateRange(postParams, 'createTime'))
    }
  }

  // 重置
  const onResetTable = () => {
    if (tableRef.current) {
      tableRef.current.queryTable({ pageNum: 1 }, 'reset')
    }
  }

  const tableSearchFormProps = {
    searchFields,
    onSearchTable,
    onResetTable
  }

  // 编辑
  const handleEdit = async (event, record) => {

  }

  // 删除
  const handleDelete = async (event, record) => {

  }

  // 详情
  const handleView = async (event, record) => {
    
  }

  // 强退
  const handleLogout = async (event, record) => {
    event.stopPropagation()

    const res = await removeOnline({ tokenId: record.tokenId })
    if (res.code === 200) {
      SageMessage.success('强退成功')
      tableRef.current.reloadTable()
      setSingle(true)
      setMultiple(true)
    }
  }

  // 表格
  const columns = [
    {
      title: '会话编号',
      dataIndex: 'tokenId',
      key: 'tokenId',
      // width: 120,
      ellipsis: true,
    },
    {
      title: '登录名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName'
    },
    {
      title: '主机',
      dataIndex: 'ipaddr',
      key: 'ipaddr'
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      key: 'loginLocation'
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser'
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os'
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 200,
      render: (text) => moment(text).format('YYYY-MM-DD hh:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '强退', auth: 'monitor:online:forceLogout', method: (e) => handleLogout(e, record), isConfirm: true, confirmInfo: `是否确认强退名称为"${record.userName}"的数据项?` }
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'tokenId',
    hasNumber: true,
    // hasCheck: true,
    columns,
    // 选中checkbox返回
    onSelectedRow: (selectedrowkeys, selectedrows) => {
      setSingle(selectedrowkeys.length !== 1)
      setMultiple(!selectedrowkeys.length)
    }
  }

  // 新建
  const onAdd = () => {

  }

  // 编辑
  const onEdit = (e) => {

  }

  // 删除
  const onDelete = (e) => {
    
  }

  // 导出
  const onExport = async () => {
    
  }

  // 表格按钮操作
  const tableToolProps = {
    
  }

  // 窗口确认按钮
  const onOk = async () => {
    
  }

  // 表单提交成功
  const onFinish = async (values) => {

  }

  return (
    <PageHeaderWrapper>

      <SageTable
        ref={tableRef}
        {...tableSearchFormProps}
        {...tableToolProps}
        {...tableProps}
        request={(params) => queryOnline(params)}
      />

    </PageHeaderWrapper>
  )
}

export default TableList
