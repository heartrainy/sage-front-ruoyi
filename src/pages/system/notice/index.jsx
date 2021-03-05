import React, { useState, useEffect, useRef } from 'react'
import KeepAlive from 'react-activation'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { queryNotice, updateNotice, addNotice, removeNotice, getNoticeDetail } from './service';
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
  const [noticeStatusOptions, setNoticeStatusOptions] = useState([])  //  状态Options
  const [noticeTypeOptions, setNoticeTypeOptions] = useState([])  //  类型Options
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // 获取状态下拉数据
  const requestNoticeStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_notice_status' })
    if (res.code === 200) {
      setNoticeStatusOptions(res.data)
    }
  }

   // 获取类型下拉数据
   const requestNoticeTypeOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_notice_type' })
    if (res.code === 200) {
      setNoticeTypeOptions(res.data)
    }
  }

  useEffect(() => {
    requestNoticeStatusOptions()
    requestNoticeTypeOptions()
  }, [])

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'noticeTitle',
      label: '公告标题',
      type: 'input',
      props: {
        placeholder: '请输入公告标题',
        allowClear: true
      }
    },
    {
      name: 'createBy',
      label: '操作人员',
      type: 'input',
      props: {
        placeholder: '请输入操作人员',
        allowClear: true
      }
    },
    {
      name: 'noticeType',
      label: '类型',
      type: 'select',
      options: noticeTypeOptions,
      valueName: 'dictValue',
      textName: 'dictLabel',
      props: {
        placeholder: '公告类型',
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
    const res = await getNoticeDetail({ noticeId: record.noticeId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑公告')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      noticeTitle: data.noticeTitle,
      noticeType: data.noticeType,
      postSort: data.postSort,
      status: data.status
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeNotice({ noticeId: record.noticeId })
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
      title: '序号',
      dataIndex: 'noticeId',
      key: 'noticeId',
      // width: 200,
      // ellipsis: true,
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
      key: 'noticeTitle',
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      key: 'noticeType',
      render: text => selectDictLabel(noticeTypeOptions, text)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => selectDictLabel(noticeStatusOptions, text)
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
      key: 'createBy',
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
          { title: '删除', auth: 'system:post:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除公告编号为"${record.noticeId}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'noticeId',
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

    const noticeIds = tableRef.current.getSelectedRowKeys()
    confirm({
      title: `是否确认删除公告编号为"${noticeIds.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {

        const res = await removeNotice({ noticeId: noticeIds.join(',') })
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

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <AuthButton auth="system:notice:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="system:notice:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="system:notice:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
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
        res = await addNotice(formData)
        break;
      case 'update':
        formData.noticeId = detail.noticeId
        res = await updateNotice(formData)
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
        request={(params) => queryNotice(params)}
      />

      <SageModal
        ref={modalRef}
        width={800}
        onOk={onOk}
        confirmLoading={modalLoading}
        // destroyOnClose
      >
        {
          status === 'add' ?
            <CreateForm
              ref={createFormRef}
              onFinish={onFinish}
              noticeStatusOptions={noticeStatusOptions}
              noticeTypeOptions={noticeTypeOptions}
            /> : null
        }
        {
          status === 'update' ?
            <UpdateForm
              ref={updateFormRef}
              detail={detail}
              onFinish={onFinish}
              noticeStatusOptions={noticeStatusOptions}
              noticeTypeOptions={noticeTypeOptions}
            /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default TableList
