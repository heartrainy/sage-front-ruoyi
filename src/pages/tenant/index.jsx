import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { queryTenant, updateTenant, addTenant, removeCrud, getTenantDetail } from './service';
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'


// 详情数据
const initDetail = {
  id: null
}

const CrudList = () => {

  // 状态数据
  const [detail, setDetail] = useState(initDetail) // 详情
  const [editable, setEditable] = useState(true)   // 编辑按钮状态
  const [removeable, setRemoveable] = useState(true)   // 删除按钮状态
  const [status, setStatus] = useState('') // 状态 1、add 2、update 3、detail
  const [modalLoading, setModalLoading] = useState(false) // 窗口loading


  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  useEffect(() => {

  }, [])

  // 查询条件
  const searchFields = [
    {
      name: 'field2',
      label: '商户名称',
      type: 'input',
      props: {
        placeholder: '请输入'
      }
    }
  ]

  // 查询
  const onSearchTable = (params) => {
    if (tableRef.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件
      // if (postParams.field19) {
      //   postParams.field19 = [
      //     moment(postParams.field19[0]).format('YYYY-MM-DD'),
      //     moment(postParams.field19[1]).format('YYYY-MM-DD'),
      //   ]
      // }

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
    const res = await getTenantDetail({ id: record.id })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      field1: data.field1,
      field2: data.field2,
      field3: data.field3,
      field4: data.field4,
      field5: data.field5
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeCrud({ idArr: [record.id] })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 表格
  const columns = [
    {
      title: '商户logo',
      dataIndex: 'field1',
      key: 'field1',
      width: 200,
    },
    {
      title: '商户名称',
      dataIndex: 'field2',
      key: 'field2',
      width: 200,
    },
    {
      title: '商户简称',
      dataIndex: 'field3',
      key: 'field3',
      width: 200,
    },
    {
      title: '商户分类',
      dataIndex: 'field4',
      key: 'field4',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'field5',
      key: 'field5',
      width: 200,
      // render: (text, record) => {
      //   return record.field4
      // }
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '编辑', method: (e) => handleEdit(e, record) },
          { title: '删除', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: '确认删除该角色?' },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      width: 120
    }
  ]

  const tableProps = {
    rowKey: 'id',
    hasNumber: true,
    hasCheck: true,
    columns,
    scroll: { x: '100vw' },
    rowSelection: {
      onChange: (selectedrowkeys, selectedrows) => {
        tableRef.current.setSelectedRowKeys(selectedrowkeys)
        tableRef.current.setSelectedRows(selectedrows)
        setEditable(selectedrowkeys.length !== 1)
        setRemoveable(selectedrowkeys.length === 0)
      }
    }
  }

  // 新建按钮
  const onAdd = () => {
    if (modalRef.current) {
      setStatus('add')
      modalRef.current.setTitle('新增')
      modalRef.current.setVisible(true)
      if (createFormRef.current) {
        createFormRef.current.resetFields()
      }
    }
  }

  // 编辑按钮
  const onEdit = (e) => {
    const rowRecords = tableRef.current.getSelectedRows()
    handleEdit(e, rowRecords[0])
  }

  // 删除按钮
  const onDelete = async (e) => {
    e.stopPropagation()

    const rowRecords = tableRef.current.getSelectedRowKeys()
    const res = await removeCrud({ idArr: rowRecords })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 导入按钮
  const onImport = (e) => {
    alert('待实现')
  }

  // 导出按钮
  const onExport = (e) => {
    alert('待实现')
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <SageButton type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</SageButton>
        </>
      )
    },
    toolOptionConfig: ['reload', 'hiddensearch', 'density', 'fullScreen']
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

    console.log('提交数据:', formData)

    // 处理赋值表单数据

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addTenant(formData)
        break;
      case 'update':
        formData.id = detail.id
        res = await updateTenant(formData)
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
        // {...tableSearchFormProps}
        // {...tableToolProps}
        {...tableProps}
        request={(params) => queryTenant(params)}
      />

      <SageModal
        ref={modalRef}
        onOk={onOk}
        width={600}
        confirmLoading={modalLoading}
      >
        {
          status === 'add' ?
          <CreateForm
            ref={createFormRef}
            onFinish={onFinish}
          /> : null
        }
        {
          status === 'update' ?
          <UpdateForm
            ref={updateFormRef}
            detail={detail}
            onFinish={onFinish}
          /> : null
        }
      </SageModal>

    </PageHeaderWrapper>
  )
}

export default CrudList
