import React, { useEffect, useState, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Modal, Switch } from 'antd'
import prompt from 'antd-prompt';
import moment from 'moment'
import AuthButton from '@/components/AuthButton'
import { SageLayoutLR, SageTable, SageModal, SageMessage, ActionSet } from '@/components/Common'
import { DeptTree, ImportModal } from '@/components/Business'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getEnumDropDownList } from '@/services/enum'
import { addDateRange, download } from '@/utils/utils'
import { queryUser, updateUser, addUser, removeUser, getUserDetail, openOrClose, resetPwd, exportUser, importUser, uploadTemplate } from './service';
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
  const [userSexOptions, setUserSexOptions] = useState([])  //  性别Options
  const [postOptions, setPostOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();
  const depttreeRef = useRef();
  const importModalRef = useRef();

  // 获取状态下拉数据
  const requestStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_normal_disable' })
    if (res.code === 200) {
      setStatusOptions(res.data)
    }
  }

  // 获取用户性别下拉数据
  const requestUserSexOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_user_sex' })
    if (res.code === 200) {
      setUserSexOptions(res.data)
    }
  }

  useEffect(() => {
    requestStatusOptions()
    requestUserSexOptions()
  }, [])

  // 查询条件
  const searchFields = [
    {
      name: 'userName',
      label: '用户名称',
      type: 'input',
      props: {
        placeholder: '请输入用户名称',
        allowClear: true
      }
    },
    {
      name: 'phonenumber',
      label: '手机号',
      type: 'input',
      props: {
        placeholder: '请输入手机号',
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
        placeholder: '用户状态',
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
    const res = await getUserDetail({ userId: record.userId })
    const { data, posts, postIds, roles, roleIds } = res
    setPostOptions(posts)
    roles.forEach(item => item.disabled = item.status === '1')
    setRoleOptions(roles)
    setDetail(data)

    modalRef.current.setTitle('编辑角色')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      nickName: data.nickName,
      // userName: data.userName,
      sex: data.sex,
      deptId: data.deptId,
      phonenumber: data.phonenumber,
      email: data.email,
      postIds: postIds,
      roleIds: roleIds,
      status: data.status,
      remark: data.remark
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeUser({ userId: record.userId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 重置密码
  const handleReset = async (event, record) => {
    event.stopPropagation()

    try {
      const newword = await prompt({
        title: `请输入${record.userName}的新密码`,
        placeholder: "",
        rules: [
          {
            required: true,
            message: "密码不能为空"
          }
        ]
        // modalProps: {
        //   width: '80%'
        // }
      });

      const res = await resetPwd({ userId: record.userId, password: newword })
      if (res.code === 200) {
        SageMessage.success(`修改成功，新密码是：${newword}`)
      }
    } catch (error) {
      SageMessage.warning(`请填写新密码`)
    }
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    confirm({
      title: `此操作将 "${checked ? '启用' : '停用'}" ${record.userName}, 是否继续？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ userId: record.userId, status: checked ? '0' : '1' })
        if (res.code === 200) {
          const tableData = tableRef.current.getDataSource()
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].userId === record.userId) {
              tableData[i].status = checked ? '0' : '1'
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
      title: '用户编号',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center'
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName'
    },
    {
      title: '部门',
      dataIndex: 'dept',
      key: 'dept',
      render: text => text?.deptName
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={text === '0'} onChange={(checked) => onChangeStatus(checked, record)} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '编辑', auth: 'system:user:edit', method: (e) => handleEdit(e, record) }
        ]

        if (record.userId !== 1) {
          actionList.push({ title: '删除', auth: 'system:user:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除用户名称为"${record.userName}"的数据项?` })
        }
        actionList.push({ title: '重置', auth: 'system:user:resetPwd', method: (e) => handleReset(e, record) },)

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 160
    }
  ]

  const tableProps = {
    rowKey: 'userId',
    // hasNumber: true,
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
      modalRef.current.setTitle('新增角色')
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

    const userIds = tableRef.current.getSelectedRowKeys()
    const userRecords = tableRef.current.getSelectedRows()
    const userNames = userRecords.map(item => item.userName)
    confirm({
      title: `是否确认删除用户名称为"${userNames.join(',')}"的数据项?`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        
        const res = await removeUser({ userId: userIds.join(',') })
        if (res.code === 200) {
          SageMessage.success('删除成功')
          tableRef.current.reloadTable()
        }
      },
      onCancel: () => {

      },
    });
  }

  // 导入
  const onImport = (e) => {
    e.stopPropagation()

    importModalRef.current.setVisible(true)
  }

  // 导入成功回调
  const importSuccess = () => {
    tableRef.current.reloadTable()
  }

  // 导出
  const onExport = async (e) => {
    e.stopPropagation()

    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认导出所有用户数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        const res = await exportUser(exportParams)
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
          <AuthButton auth="system:user:add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth="system:user:edit" type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={single} style={{ marginLeft: '8px' }}>编辑</AuthButton>
          <AuthButton auth="system:user:remove" type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={multiple} style={{ marginLeft: '8px' }}>删除</AuthButton>
          <AuthButton auth="system:user:import" icon={<VerticalAlignTopOutlined />} onClick={(e) => onImport(e)} style={{marginLeft: '8px'}}>导入</AuthButton>
          <AuthButton auth="system:user:export" type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onExport(e)} style={{marginLeft: '8px'}}>导出</AuthButton>
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
        res = await addUser(formData)
        break;
      case 'update':
        formData.userId = detail.userId
        formData.userName = detail.userName
        res = await updateUser(formData)
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

  // 刷新组织部门
  const onRefreshDept = () => {
    depttreeRef.current.refresh()
    depttreeRef.current.setSelectedKeys([])
    onSearchTable({ deptId: '' })
  }

  const onSelectDept = (deptId) => {
    onSearchTable({ deptId })
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
                <RedoOutlined style={{ cursor: 'pointer' }} onClick={onRefreshDept} />
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
              userSexOptions={userSexOptions}
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
              userSexOptions={userSexOptions}
              postOptions={postOptions}
              roleOptions={roleOptions}
            /> : null
        }
      </SageModal>

      <ImportModal 
        ref={importModalRef}
        importSuccess={importSuccess}
        request={(params) => importUser(params)}
        downloadTemplate={uploadTemplate}
      />

    </PageHeaderWrapper>
  )
}

export default TableList
