import React, { useState, useEffect, useRef } from 'react'
import { history, connect } from 'umi'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, ExceptionOutlined } from '@ant-design/icons';
import { queryJob, updateJob, addJob, removeJob, getJobDetail, openOrClose, exportJob, runJob } from './service';
import { getEnumDropDownList } from '@/services/enum'
import { download, selectDictLabel } from '@/utils/utils'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
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
  const [jobStatusOptions, setJobStatusOptions] = useState([])  //  任务状态Options
  const [jobGroupOptions, setJobGroupOptions] = useState([])  //  任务组名Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取任务状态下拉数据
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
      label: '任务状态',
      type: 'select',
      options: jobStatusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '请选择任务状态',
        allowClear: true
      }
    }
  ]

  // 查询
  const onSearchTable = (params) => {
    if (tableRef.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件

      tableRef.current.queryTable(postParams)
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
    event.stopPropagation()

    setStatus('update')
    const res = await getJobDetail({ jobId: record.jobId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑任务')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      jobName: data.jobName,
      jobGroup: data.jobGroup,
      invokeTarget: data.invokeTarget,
      cronExpression: data.cronExpression,
      misfirePolicy: data.misfirePolicy,
      concurrent: data.concurrent,
      status: data.status
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeJob({ jobId: record.jobId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
      setSingle(true)
      setMultiple(true)
    }
  }

  // 执行
  const handleRun = async (event, record) => {
    event.stopPropagation()

    const res = await runJob({ jobId: record.jobId, jobGroup: record.jobGroup })
    if (res.code === 200) {
      SageMessage.success('执行成功')
      tableRef.current.reloadTable()
    }
  }

  // 详情
  const handleView = async (event, record) => {
    event.stopPropagation()

    setStatus('view')
    setDetail(record)

    modalRef.current.setTitle('任务详情')
    modalRef.current.setVisible(true)
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    confirm({
      title: `确认要 "${checked ? '启用' : '停用'}" ${record.jobName}任务吗？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ jobId: record.jobId, status: checked ? '0' : '1' })
        if (res.code === 200) {
          const tableData = tableRef.current.getDataSource()
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].jobId === record.jobId) {
              tableData[i].status = checked ? '0' : '1'
              break;
            }
          }
          tableRef.current.setDataSource(tableData)
          SageMessage.success(checked ? '启用成功' : '暂停成功')
        }
      },
      onCancel: () => {

      },
    });
  }

  // 表格
  const columns = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      key: 'jobId',
      // width: 200,
      // ellipsis: true,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
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
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch checkedChildren="启用" unCheckedChildren="暂停" checked={text === '0'} onChange={(checked) => onChangeStatus(checked, record)} />
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '执行一次', method: (e) => handleRun(e, record), isConfirm: true, confirmInfo: `确认要立即执行一次"${record.jobName}"任务吗?` },
          { title: '详情', method: (e) => handleView(e, record) }
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'jobId',
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
    if (modalRef.current) {
      setStatus('add')
      modalRef.current.setTitle('新增公告')
      modalRef.current.setVisible(true)
      if (createFormRef.current) {
        createFormRef.current.resetFields()
      }
    }
  }

  // 编辑
  const onEdit = (e) => {
    const rowRecords = tableRef.current.getSelectedRows()
    handleEdit(e, rowRecords[0])
  }

  // 删除
  const onDelete = (e) => {
    e.stopPropagation()

    const jobIds = tableRef.current.getSelectedRowKeys()
    confirm({
      title: `是否确认删除定时任务编号为"${jobIds.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {

        const res = await removeJob({ jobId: jobIds.join(',') })
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
      content: '是否确认导出所有定时任务数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportJob(exportParams)
        if (res.code === 200) {
          download(res.msg)
        }
      },
      onCancel: () => {

      },
    });
  }

  // 日志
  const onJobLog = (event) => {
    event.stopPropagation()

    // 跳转tab
    props.dispatch({
      type: 'global/goTab',
      payload: {
        path: '/job/log',
        name: '操作日志'
      }
    })
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <AuthButton auth="monitor:job:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="monitor:job:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="monitor:job:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="monitor:job:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
          <AuthButton auth="monitor:job:query" icon={<ExceptionOutlined />} onClick={(e) => onJobLog(e)} style={{ marginLeft: '8px' }}>日志</AuthButton>
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
  }

  // 表单提交成功
  const onFinish = async (values) => {
    const formData = Object.assign({}, values)
    // 处理赋值表单数据
    // TODO

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addJob(formData)
        break;
      case 'update':
        formData.jobId = detail.jobId
        res = await updateJob(formData)
        break
      default:
        break;
    }
    setModalLoading(false)

    if (res.code === 200) {
      SageMessage.success('保存成功')
      modalRef.current.setVisible(false)
      tableRef.current.reloadTable()
    }
  }

  const footer = {}
  if (status === 'view') {
    footer.footer = null
  }

  return (
    <PageHeaderWrapper>

      <SageTable
        ref={tableRef}
        {...tableSearchFormProps}
        {...tableToolProps}
        {...tableProps}
        request={(params) => queryJob(params)}
      />

      <SageModal
        ref={modalRef}
        width={600}
        onOk={onOk}
        confirmLoading={modalLoading}
        {...footer}
      // destroyOnClose
      >
        {
          status === 'add' ?
            <CreateForm
              ref={createFormRef}
              onFinish={onFinish}
              jobStatusOptions={jobStatusOptions}
              jobGroupOptions={jobGroupOptions}
            /> : null
        }
        {
          status === 'update' ?
            <UpdateForm
              ref={updateFormRef}
              detail={detail}
              onFinish={onFinish}
              jobStatusOptions={jobStatusOptions}
              jobGroupOptions={jobGroupOptions}
            /> : null
        }
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

export default connect(({ global }) => ({
  global
}))(TableList)
