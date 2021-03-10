import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { history, connect } from 'umi'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, SyncOutlined } from '@ant-design/icons';
import { queryLogininfor, updateOper, addOper, removeLogininfor, exportLogininfor, clean } from './service';
import { getEnumDropDownList } from '@/services/enum'
import { addDateRange, download, selectDictLabel } from '@/utils/utils'
import ViewForm from './components/ViewForm'

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

  // 获取操作状态下拉数据
  const requestCommonStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_common_status' })
    if (res.code === 200) {
      setCommonStatusOptions(res.data)
    }
  }

  useEffect(() => {
    requestCommonStatusOptions()
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
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: commonStatusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '登录状态',
        allowClear: true
      }
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'rangepicker',
      props: {
        style: { width: '100%' },
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

  // 表格
  const columns = [
    {
      title: '访问编号',
      dataIndex: 'infoId',
      key: 'infoId',
      // width: 120,
      // ellipsis: true,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '登录地址',
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
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(commonStatusOptions, text)
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 200
    }
  ]

  const tableProps = {
    rowKey: 'infoId',
    hasCheck: true,
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
    e.stopPropagation()

    const infoIds = tableRef.current.getSelectedRowKeys()
    confirm({
      title: `是否确认删除访问编号为"${infoIds.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {

        const res = await removeLogininfor({ infoId: infoIds.join(',') })
        if (res.code === 200) {
          SageMessage.success('删除成功')
          tableRef.current.reloadTable()
          setSingle(true)
          setMultiple(true)
        }
      },
      onCancel: () => {

      },
    });
  }

  // 导出
  const onExport = async () => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认导出所有操作日志数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportLogininfor(addDateRange(exportParams, 'createTime'))
        if (res.code === 200) {
          download(res.msg)
        }
      },
      onCancel: () => {

      },
    });
  }

  // 清理缓存
  const onClear = async () => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认清空所有操作日志数据项?',
      onOk: async () => {
        const res = await clean()
        if (res.code === 200) {
          SageMessage.success('清空成功')
          tableRef.current.reloadTable()
          setSingle(true)
          setMultiple(true)
        }
      },
      onCancel: () => {

      },
    });
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <AuthButton auth="monitor:operlog:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="monitor:operlog:remove" type="danger" icon={<SyncOutlined />} onClick={(e) => onClear(e)} style={{ marginLeft: '8px' }}>清空</AuthButton>
          <AuthButton auth="monitor:operlog:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
        </>
      )
    }
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
        request={(params) => queryLogininfor(params)}
      />

    </PageHeaderWrapper>
  )
}

export default TableList
