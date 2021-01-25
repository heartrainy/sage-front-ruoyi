import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Switch, Modal } from 'antd'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { PlusOutlined, EditOutlined, SwapOutlined, ExclamationCircleOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getEnumDropDownList } from '@/services/enum'
import { queryDept, updateDept, addDept, removeDept, getDeptDetail, openOrClose } from './service';
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'

const { confirm } = Modal

// 详情数据
const initDetail = {
  id: null
}

const DeptList = () => {

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
    // {
    //   name: 'menuName',
    //   label: '菜单名称',
    //   type: 'input',
    //   props: {
    //     placeholder: '请输入'
    //   }
    // },
    // {
    //   name: 'status',
    //   label: '菜单状态',
    //   type: 'select',
    //   options: [
    //     {text: '显示', value: '1'},
    //     {text: '隐藏', value: '0'}
    //   ],
    //   props: {
    //     allowClear: true
    //   }
    // },
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
    const res = await getDeptDetail({ id: record.id })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      fatherOrgnId: data.fatherOrgnId,
      orgnName: data.orgnName,
      orderNum: data.orderNum,
      leader: data.leader,
      phone: data.phone,
      email: data.email,
      status: data.status === '1'
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeDept({ id: record.id })
    if (res.isSuccess) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    confirm({
      title: `此操作将 "${checked ? '启用' : '停用'}" ${record.orgnName}, 是否继续？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ id: record.id })
        if (res.isSuccess) {
          const tableData = tableRef.current.getDataSource()
          const loopChangeStatus = (list) => {
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === record.id) {
                list[i].status = checked ? '1' : '0'
                break;
              }
              if (list[i].children && list[i].children.length !== 0) {
                loopChangeStatus(list[i].children)
              }
            }
          }
          loopChangeStatus(tableData)
          tableRef.current.setDataSource(tableData)
          SageMessage.success(checked ? '启用成功' : '禁用成功')
        }
      },
      onCancel: () => {

      },
    });
  }

  // 表格
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'orgnName',
      key: 'orgnName',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={text === '1'} onChange={(checked) => onChangeStatus(checked, record)} />
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200
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
          { title: '删除', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: '确认删除该菜单?' },
        ]

        return record.fatherOrgnId !== 0 ? <ActionSet actionList={actionList} record={record} /> : null
      },
      width: 120
    }
  ]

  const renderDeptData = data => {
    const tempData = data.slice()
    const removeChildren = list => {
      list.forEach(item => {
        if (item.children && item.children.length === 0) {
          delete item.children
        }
        if (item.children && item.children.length !== 0) {
          removeChildren(item.children)
        }
      })
    }
    removeChildren(tempData)

    return tempData
  }

  const tableProps = {
    rowKey: 'id',
    // hasCheck: true,
    columns,
    // scroll: { x: '100vw' },
    pagination: false,
    expandable: true,
    defaultExpandAllRows: true,
    rowSelection: {
      type: 'checkbox',
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
    const res = await removeDept({ idArr: rowRecords })
    if (res.isSuccess) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  const onExpand = () => {
    let expandRowKeys = tableRef.current.getExpandedRowKeys()
    if (expandRowKeys.length === 0) {
      expandRowKeys = tableRef.current.getAllExpandedRowKeys()
      tableRef.current.setExpandedRowKeys(expandRowKeys)
    } else {
      tableRef.current.setExpandedRowKeys([])
    }
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <SageButton type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</SageButton>
          {/* <SageButton type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={editable} style={{marginLeft: '8px'}}>编辑</SageButton> */}
          <SageButton type="waring" icon={<SwapOutlined />} onClick={(e) => onExpand(e)} style={{marginLeft: '8px'}}>全部展开/折叠</SageButton>
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
    // 处理赋值表单数据
    // TODO

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addDept(formData)
        break;
      case 'update':
        formData.id = detail.id
        res = await updateDept(formData)
        break
      default:
        break;
    }
    setModalLoading(false)

    if (res.isSuccess) {
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
        request={(params) => queryDept(params)}
        renderData={data => renderDeptData(data)}
      />

      <SageModal
        ref={modalRef}
        onOk={onOk}
        width={600}
        confirmLoading={modalLoading}
        destroyOnClose
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

export default DeptList
