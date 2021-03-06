import React, { useState, useEffect, useRef } from 'react'
import KeepAlive from 'react-activation'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { history, connect } from 'umi'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined, SyncOutlined } from '@ant-design/icons';
import { queryDict, updateDict, addDict, removeDict, getDictDetail, exportDict, clearCache } from './service';
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
  const [statusOptions, setStatusOptions] = useState([])  //  状态Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取状态下拉数据
  const requestStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_normal_disable' })
    if (res.code === 200) {
      setStatusOptions(res.data)
    }
  }

  useEffect(() => {
    requestStatusOptions()
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'dictName',
      label: '字典名称',
      type: 'input',
      props: {
        placeholder: '请输入字典名称',
        allowClear: true
      }
    },
    {
      name: 'dictType',
      label: '字典类型',
      type: 'input',
      props: {
        placeholder: '请输入字典类型',
        allowClear: true
      }
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      options: statusOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '字典状态',
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
    const res = await getDictDetail({ dictId: record.dictId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑字典类型')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      dictName: data.dictName,
      dictType: data.dictType,
      status: data.status,
      remark: data.remark
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeDict({ dictId: record.dictId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
      setSingle(true)
      setMultiple(true)
    }
  }

  // 跳转字典数据
  const goDictData = (event, record) => {
    event.stopPropagation()

    const path = `/dict/type/data/${record.dictId}`

    // 跳转tab
    props.dispatch({
      type: 'global/goTab',
      payload: {
        path: path,
        name: '字典数据'
      }
    })
  }

  // 表格
  const columns = [
    {
      title: '字典编号',
      dataIndex: 'dictId',
      key: 'dictId',
      // width: 200,
      // ellipsis: true,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
      render: (text, record) => {
        return (
          <a onClick={(e) => goDictData(e, record)}>{text}</a>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(statusOptions, text)
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      // width: 200
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '编辑', auth: 'system:dict:edit', method: (e) => handleEdit(e, record) },
          { title: '删除', auth: 'system:dict:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除字典名称为"${record.dictName}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'dictId',
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
      modalRef.current.setTitle('新增字典类型')
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

    const dictIds = tableRef.current.getSelectedRowKeys()
    const dictRecords = tableRef.current.getSelectedRows()
    const dictNames = dictRecords.map(item => item.dictName)
    confirm({
      title: `是否确认删除字典名称为"${dictNames.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {

        const res = await removeDict({ dictId: dictIds.join(',') })
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
      content: '是否确认导出所有类型数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportDict(addDateRange(exportParams, 'createTime'))
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
          <AuthButton auth="system:dict:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="system:dict:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="system:dict:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="system:dict:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
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
        res = await addDict(formData)
        break;
      case 'update':
        formData.dictId = detail.dictId
        res = await updateDict(formData)
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
        request={(params) => queryDict(params)}
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
              statusOptions={statusOptions}
            /> : null
        }
        {
          status === 'update' ?
            <UpdateForm
              ref={updateFormRef}
              detail={detail}
              onFinish={onFinish}
              statusOptions={statusOptions}
            /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default connect(({ global }) => ({
  global
}))(TableList)
