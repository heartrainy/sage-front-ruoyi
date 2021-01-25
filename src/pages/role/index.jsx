import React, { useState, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { SageLayoutLR, SageTable, SageModal, SageForm, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { MenuTree } from '@/components/Business'
import { PlusOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { queryRule, updateRule, addRule, removeRule, getRuleDetail, openOrClose } from './service';
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
  const [role, setRole] = useState({})   // 菜单分配对象

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();
  const menutreeRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'roleName',
      label: '角色名',
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
    const res = await getRuleDetail({ id: record.id })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑角色')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      roleName: data.roleName,
      orderNum: data.orderNum,
      status: data.status === '1'
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeRule({ id: record.id })
    if (res.isSuccess) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 授权菜单
  const handleAuth = async (event, record) => {
    event.stopPropagation()

    const res = await getRuleDetail({ id: record.id })
    const { data: { id, authList } } = res

    const checkedKeys = []
    authList && authList.forEach(item => {
      checkedKeys.push(item)
    })

    menutreeRef.current.setCheckedKeys(checkedKeys)
    setRole({id})
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    confirm({
      title: `此操作将 "${checked ? '启用' : '停用'}" ${record.roleName}, 是否继续？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ id: record.id })
        if (res.isSuccess) {
          const tableData = tableRef.current.getDataSource()
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].id === record.id) {
              tableData[i].status = checked ? '1' : '0'
              break;
            }
          }
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
      title: '角色名',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: '角色状态',
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
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '授权菜单', method: (e) => handleAuth(e, record) },
          { title: '编辑', method: (e) => handleEdit(e, record) },
          { title: '删除', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: '确认删除该角色?' },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      width: 180
    }
  ]

  const tableProps = {
    rowKey: 'id',
    hasNumber: true,
    columns
  }

  // 新建
  const onAdd = () => {
    if (modalRef.current) {
      setStatus('add')
      modalRef.current.setTitle('新增角色')
      modalRef.current.setVisible(true)
      if (createFormRef.current) {
        createFormRef.current.resetFields()
      }
    }
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
    // 处理赋值表单数据
    // TODO
    formData.status = formData.status ? '1' : '0'

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addRule(formData)
        break;
      case 'update':
        formData.id = detail.id
        res = await updateRule(formData)
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

  // 保存授权菜单
  const onSaveMenuRole = async () => {
    const checkedKeys = menutreeRef.current.getCheckedKeys()
    const halfCheckedKeys = menutreeRef.current.getHalfCheckedKeys()

    const pp = {
      ...role,
      // authList: checkedKeys.checked   // 非关联
      authList: checkedKeys.concat(halfCheckedKeys) // 关联
    }

    const res = await updateRule(pp)

    if (res.isSuccess) {
      SageMessage.success('保存成功')
    }
  }

  return (
    <PageHeaderWrapper>

      <SageLayoutLR
        left={
          <SageTable
            ref={tableRef}
            {...tableSearchFormProps}
            {...tableToolProps}
            {...tableProps}
            request={(params) => queryRule(params)}
          />
        }
        rightWidth={350}
        right={
          <div style={{ padding: 12, height: '100%' }}>
            <Card title="菜单分配" extra={<SageButton disabled={Object.keys(role).length === 0} type="primary" onClick={onSaveMenuRole} icon={<CheckOutlined />}>保存</SageButton>} size="small" style={{ height: '100%' }}>
              <MenuTree
                ref={menutreeRef}
              />
            </Card>
          </div>

        }
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

export default TableList
