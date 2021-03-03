import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { queryPost, updatePost, addPost, removePost, getPostDetail, exportPost } from './service';
import { getEnumDropDownList } from '@/services/enum'
import { download, selectDictLabel } from '@/utils/utils'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'

const { confirm } = Modal

const initDetail = {
  id: null
}

const TableList = () => {

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
      name: 'postCode',
      label: '岗位编码',
      type: 'input',
      props: {
        placeholder: '请输入岗位编码',
        allowClear: true
      }
    },
    {
      name: 'postName',
      label: '岗位名称',
      type: 'input',
      props: {
        placeholder: '请输入岗位名称',
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
        placeholder: '角色状态',
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
    const res = await getPostDetail({ postId: record.postId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑岗位')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      postName: data.postName,
      postCode: data.postCode,
      postSort: data.postSort,
      status: data.status,
      remark: data.remark
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removePost({ postId: record.postId })
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
      title: '岗位编号',
      dataIndex: 'postId',
      key: 'postId',
      // width: 200,
      // ellipsis: true,
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      key: 'postCode',
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      key: 'postName',
    },
    {
      title: '岗位排序',
      dataIndex: 'postSort',
      key: 'postSort',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(statusOptions, text)
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
          { title: '编辑', auth: 'system:post:edit', method: (e) => handleEdit(e, record) },
          { title: '删除', auth: 'system:post:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除岗位名称为"${record.postName}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'postId',
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
      modalRef.current.setTitle('新增岗位')
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

    const postIds = tableRef.current.getSelectedRowKeys()
    const postRecords = tableRef.current.getSelectedRows()
    const postNames = postRecords.map(item => item.postName)
    confirm({
      title: `是否确认删除岗位名称为"${postNames.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {

        const res = await removePost({ postId: postIds.join(',') })
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
      content: '是否确认导出所有岗位数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportPost(exportParams)
        if (res.code === 200) {
          download(res.msg)
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
          <AuthButton auth="system:post:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="system:post:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="system:post:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="system:post:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{ marginLeft: '8px' }}>导出</AuthButton>
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
        res = await addPost(formData)
        break;
      case 'update':
        formData.postId = detail.postId
        res = await updatePost(formData)
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
        request={(params) => queryPost(params)}
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

export default TableList
