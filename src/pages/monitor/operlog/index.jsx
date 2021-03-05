import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { history, connect } from 'umi'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, SyncOutlined } from '@ant-design/icons';
import { queryOper, updateOper, addOper, removeOper, exportOper, clean } from './service';
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
  const [commonStatusOptions, setCommonStatusOptions] = useState([])  //  操作状态Options
  const [operTypeOptions, setOperTypeOptions] = useState([])  //  状态Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取操作状态下拉数据
  const requestCommonStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_common_status' })
    if (res.code === 200) {
      setCommonStatusOptions(res.data)
    }
  }

  // 获取类型下拉数据
  const requestOperTypeOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_oper_type' })
    if (res.code === 200) {
      setOperTypeOptions(res.data)
    }
  }

  useEffect(() => {
    requestCommonStatusOptions()
    requestOperTypeOptions()
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'title',
      label: '系统模块',
      type: 'input',
      props: {
        placeholder: '请输入系统模块',
        allowClear: true
      }
    },
    {
      name: 'operName',
      label: '操作人员',
      type: 'input',
      props: {
        placeholder: '请输入操作人员',
        allowClear: true
      }
    },
    {
      name: 'operatorType',
      label: '类型',
      type: 'select',
      options: operTypeOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '操作类型',
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
        placeholder: '操作状态',
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
    event.stopPropagation()

    setStatus('view')
    setDetail(record)

    modalRef.current.setTitle('操作日志详情')
    modalRef.current.setVisible(true)
  }

  // 表格
  const columns = [
    {
      title: '日志编号',
      dataIndex: 'operId',
      key: 'operId',
      // width: 120,
      // ellipsis: true,
    },
    {
      title: '系统模块',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '操作类型',
      dataIndex: 'operatorType',
      key: 'operatorType',
      render: text => selectDictLabel(operTypeOptions, text)
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      key: 'requestMethod'
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
      key: 'operName',
    },
    {
      title: '主机',
      dataIndex: 'operIp',
      key: 'operIp',
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
      key: 'operLocation',
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(commonStatusOptions, text)
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
      key: 'operTime',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '详细', auth: 'monitor:operlog:query', method: (e) => handleView(e, record) }
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'operId',
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

    const operIds = tableRef.current.getSelectedRowKeys()
    confirm({
      title: `是否确认删除日志编号为"${operIds.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {

        const res = await removeOper({ operId: operIds.join(',') })
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
        const res = await exportOper(addDateRange(exportParams, 'createTime'))
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
    },
    // toolOptionConfig: ['reload', 'hiddensearch', 'density', 'fullScreen', 'setting']
  }

  // 窗口确认按钮
  const onOk = async () => {
    if (status === 'add' && createFormRef.current) {
      createFormRef.current.submit();
    }
    if (status === 'update' && updateFormRef.current) {
      updateFormRef.current.submit();
    }
    if (status === 'view') {
      modalRef.current.setVisible(false)
    }
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
        request={(params) => queryOper(params)}
      />

      <SageModal
        ref={modalRef}
        width={600}
        onOk={onOk}
        confirmLoading={modalLoading}
        footer={null}
      >
        {
          status === 'view' ? <ViewForm detail={detail} operTypeOptions={operTypeOptions} commonStatusOptions={commonStatusOptions} /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default TableList
