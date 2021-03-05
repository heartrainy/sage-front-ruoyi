import React, { useState, useEffect, useRef } from 'react'
import KeepAlive from 'react-activation'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { history, connect } from 'umi'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, SyncOutlined } from '@ant-design/icons';
import { queryConfig, updateConfig, addConfig, removeConfig, getConfigDetail, exportConfig, clearCache } from './service';
import { getEnumDropDownList } from '@/services/enum'
import { addDateRange, download, selectDictLabel } from '@/utils/utils'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'

const { confirm } = Modal

const initDetail = {
  id: null
}

const TableList = (props) => {

  // 状态
  const [detail, setDetail] = useState(initDetail) // 详情
  const [status, setStatus] = useState('') // 状态 1、add 2、update 3、detail
  const [modalLoading, setModalLoading] = useState(false) // 窗口loading
  const [configTypeOptions, setConfigTypeOptions] = useState([])  //  状态Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取系统内置下拉数据
  const requestConfigTypeOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_yes_no' })
    if (res.code === 200) {
      setConfigTypeOptions(res.data)
    }
  }

  useEffect(() => {
    requestConfigTypeOptions()
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'configName',
      label: '参数名称',
      type: 'input',
      props: {
        placeholder: '请输入参数名称',
        allowClear: true
      }
    },
    {
      name: 'configKey',
      label: '参数键名',
      type: 'input',
      props: {
        placeholder: '请输入参数键名',
        allowClear: true
      }
    },
    {
      name: 'configType',
      label: '系统内置',
      type: 'select',
      options: configTypeOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '系统内置',
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
    event.stopPropagation()

    setStatus('update')
    const res = await getConfigDetail({ configId: record.configId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑参数')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      configName: data.configName,
      configKey: data.configKey,
      configValue: data.configValue,
      configType: data.configType,
      remark: data.remark
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeConfig({ configId: record.configId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
      setSingle(true)
      setMultiple(true)
    }
  }

  // 表格
  const columns = [
    {
      title: '参数主键',
      dataIndex: 'configId',
      key: 'configId',
      width: 120,
      // ellipsis: true,
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      key: 'configName',
      ellipsis: true
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      key: 'configKey',
      ellipsis: true
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
      key: 'configValue',
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      key: 'configType',
      render: text => selectDictLabel(configTypeOptions, text)
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true
    },
    {
      title: '创建时间',
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
          { title: '编辑', auth: 'system:config:edit', method: (e) => handleEdit(e, record) },
          { title: '删除', auth: 'system:config:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除参数名称为"${record.configName}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'configId',
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
      modalRef.current.setTitle('新增参数')
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

    const configIds = tableRef.current.getSelectedRowKeys()
    const configRecords = tableRef.current.getSelectedRows()
    const configNames = configRecords.map(item => item.configName)
    confirm({
      title: `是否确认删除参数名称为"${configNames.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {

        const res = await removeConfig({ configId: configIds.join(',') })
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
      content: '是否确认导出所有参数数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportConfig(exportParams)
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
    const res = await clearCache()
    if (res.code === 200) {
      SageMessage.success('清理成功')
    }
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <AuthButton auth="system:config:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="system:config:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="system:config:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="system:config:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
          <AuthButton type="danger" icon={<SyncOutlined />} onClick={(e) => onClear(e)} style={{ marginLeft: '8px' }}>清理缓存</AuthButton>
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
        res = await addConfig(formData)
        break;
      case 'update':
        formData.configId = detail.configId
        res = await updateConfig(formData)
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

  return (
    <PageHeaderWrapper>

      <SageTable
        ref={tableRef}
        {...tableSearchFormProps}
        {...tableToolProps}
        {...tableProps}
        request={(params) => queryConfig(params)}
      />

      <SageModal
        ref={modalRef}
        onOk={onOk}
        confirmLoading={modalLoading}
      >
        {
          status === 'add' ?
            <CreateForm
              ref={createFormRef}
              onFinish={onFinish}
              configTypeOptions={configTypeOptions}
            /> : null
        }
        {
          status === 'update' ?
            <UpdateForm
              ref={updateFormRef}
              detail={detail}
              onFinish={onFinish}
              configTypeOptions={configTypeOptions}
            /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default connect(({ global }) => ({
  global
}))(TableList)
