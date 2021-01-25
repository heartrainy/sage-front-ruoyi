import React, { useState, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Modal, Switch } from 'antd'
import moment from 'moment'
import { SageLayoutLR, SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { DeptTree } from '@/components/Business'
import { PlusOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { queryUser, updateUser, addUser, removeUser, getUserDetail, openOrClose } from './service';
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

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();
  const depttreeRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'personName',
      label: '用户名',
      type: 'input',
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'mobile',
      label: '手机号',
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
    const res = await getUserDetail({ id: record.loginId })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑角色')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      personName: data.personName,
      sex: data.sex,
      idNo: data.idNo,
      personNo: data.personNo,
      entryTime: data.entryTime ? moment(data.entryTime) : '',
      orgnId: data.orgnId,
      mobile: data.mobile,
      email: data.email,
      roleIds: data.roleIds ? data.roleIds.split(',') : [],
      status: data.status === '1',
      headImage: data.headImage
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeUser({ id: record.loginId })
    if (res.isSuccess) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    confirm({
      title: `此操作将 "${checked ? '启用' : '停用'}" ${record.personName}, 是否继续？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ loginId: record.loginId })
        if (res.isSuccess) {
          const tableData = tableRef.current.getDataSource()
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].loginId === record.loginId) {
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
      title: '用户名',
      dataIndex: 'personName',
      key: 'personName'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: text => text === '1' ? '男' : '女'
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '部门',
      dataIndex: 'orgnName',
      key: 'orgnName',
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={text === '1'} onChange={(checked) => onChangeStatus(checked, record)} />
    },
    {
      title: '操作',
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
      width: 160
    }
  ]

  const tableProps = {
    rowKey: 'loginId',
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
        res = await addUser(formData)
        break;
      case 'update':
        formData.loginId = detail.loginId
        res = await updateUser(formData)
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

  // 刷新组织部门
  const onRefreshDept = () => {
    depttreeRef.current.refresh()
    depttreeRef.current.setSelectedKeys([])
    onSearchTable({orgnId: ''})
  }

  const onSelectDept = (orgnId) => {
    onSearchTable({orgnId})
  }

  return (
    <PageHeaderWrapper>

      <SageLayoutLR
        leftWidth={250}
        left={
          <div style={{ padding: '0 12px 12px 0', height: '100%' }}>
            <Card
              title="组织部门"
              extra={
                <RedoOutlined style={{cursor: 'pointer'}} onClick={onRefreshDept} />
              }
              size="small"
              style={{ height: '100%' }}>
                <DeptTree
                  ref={depttreeRef}
                  onSelect={onSelectDept}
                />
            </Card>
          </div>
        }
        right={
          <SageTable
            ref={tableRef}
            {...tableSearchFormProps}
            {...tableToolProps}
            {...tableProps}
            request={(params) => queryUser(params)}
          />
        }
      />

      <SageModal
        ref={modalRef}
        onOk={onOk}
        confirmLoading={modalLoading}
        width={800}
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
