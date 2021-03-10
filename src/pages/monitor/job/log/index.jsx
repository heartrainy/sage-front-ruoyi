import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { history, connect } from 'umi'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, SyncOutlined } from '@ant-design/icons';
import { queryJobLog, removeJobLog, exportJobLog, clean } from './service';
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
  const [jobStatusOptions, setJobStatusOptions] = useState([])  //  执行状态Options
  const [jobGroupOptions, setJobGroupOptions] = useState([])  //  任务组名Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取执行状态下拉数据
  const requestJobStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_job_status' })
    if (res.code === 200) {
      setJobStatusOptions(res.data)
    }
  }

  // 获取任务组名下拉数据
  const requestJobGroupOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_job_group' })
    if (res.code === 200) {
      setJobGroupOptions(res.data)
    }
  }

  useEffect(() => {
    requestJobStatusOptions()
    requestJobGroupOptions()
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'jobName',
      label: '任务名称',
      type: 'input',
      props: {
        placeholder: '请输入任务名称',
        allowClear: true
      }
    },
    {
      name: 'jobGroup',
      label: '任务组名',
      type: 'select',
      options: jobGroupOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '请选择任务组名',
        allowClear: true
      }
    },
    {
      name: 'status',
      label: '执行状态',
      type: 'select',
      options: jobStatusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '请选择执行状态',
        allowClear: true
      }
    },
    {
      name: 'createTime',
      label: '执行时间',
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

    modalRef.current.setTitle('调度日志详情')
    modalRef.current.setVisible(true)
  }

  // 表格
  const columns = [
    {
      title: '日志编号',
      dataIndex: 'jobLogId',
      key: 'jobLogId',
      // width: 120,
      // ellipsis: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName'
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      key: 'jobGroup',
      render: text => selectDictLabel(jobGroupOptions, text)
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      key: 'invokeTarget',
      ellipsis: true,
    },
    {
      title: '日志信息',
      dataIndex: 'jobMessage',
      key: 'jobMessage',
      ellipsis: true,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(jobStatusOptions, text)
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '详细', auth: 'monitor:job:query', method: (e) => handleView(e, record) }
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'jobLogId',
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

    const jobLogIds = tableRef.current.getSelectedRowKeys()
    confirm({
      title: `是否确认删除调度日志编号为"${jobLogIds.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {

        const res = await removeJobLog({ jobLogId: jobLogIds.join(',') })
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
      content: '是否确认导出所有调度日志数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportJobLog(addDateRange(exportParams, 'createTime'))
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
          <AuthButton auth="monitor:job:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="monitor:job:remove" type="danger" icon={<SyncOutlined />} onClick={(e) => onClear(e)} style={{ marginLeft: '8px' }}>清空</AuthButton>
          <AuthButton auth="monitor:job:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
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
        request={(params) => queryJobLog(params)}
      />

      <SageModal
        ref={modalRef}
        width={600}
        onOk={onOk}
        confirmLoading={modalLoading}
        footer={null}
      >
        {
          status === 'view' ? 
            <ViewForm 
              detail={detail} 
              jobStatusOptions={jobStatusOptions} 
              jobGroupOptions={jobGroupOptions}
            /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default TableList
