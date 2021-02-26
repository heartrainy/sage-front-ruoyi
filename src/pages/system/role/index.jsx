import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Switch, Modal } from 'antd'
import { SageLayoutLR, SageTable, SageModal, SageForm, SageButton, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { MenuTree } from '@/components/Business'
import { PlusOutlined, CheckOutlined, ExclamationCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { queryRole, updateRole, addRole, removeRole, getRoleDetail, openOrClose, getMenuByRoleId, exportRole } from './service';
import { getEnumDropDownList } from '@/services/enum'
import { addDateRange, download } from '@/utils/utils'
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
  const [statusOptions, setStatusOptions] = useState([])  //  状态Options

  // 获取状态下拉数据
  const requestStatusOptions = async () => {
    const res = await getEnumDropDownList({type: 'sys_normal_disable'})
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
  const menutreeRef = useRef();

  // 查询条件
  const searchFields = [
    {
      name: 'roleName',
      label: '角色名',
      type: 'input',
      props: {
        placeholder: '请输入角色名',
        allowClear: true
      }
    },
    {
      name: 'roleKey',
      label: '权限字符',
      type: 'input',
      props: {
        placeholder: '请输入权限字符',
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
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'rangepicker',
      props: {
        style: {width: '100%'},
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
    const res = await getRoleDetail({ roleId: record.roleId })
    const { data } = res
    setDetail(data)

    requestMenuByRoleId(record)

    modalRef.current.setTitle('编辑角色')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      roleKey: data.roleKey,
      roleName: data.roleName,
      roleSort: data.roleSort,
      status: data.status,
      remark: data.remark
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeRole({ roleId: record.roleId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 处理菜单数据
  const filterMenuTree = (arr) => {

    arr.forEach(item => {
      item.title = item.label
      item.key = item.id
      if (item.children && item.children.length !== 0) {
        item.children = item.children.slice()
        filterMenuTree(item.children)
      }
    })
  }

  const requestMenuByRoleId = async (record) => {
    const res = await getMenuByRoleId({ roleId: record.roleId })
    if (res.code === 200) {
      const { menus, checkedKeys } = res
      filterMenuTree(menus)
      menutreeRef.current.setMenuTree(menus)
      menutreeRef.current.setCheckedKeys(checkedKeys)
      setRole({
        ...record,
        menuIds: checkedKeys.slice()
      })
    }
  }

  // 授权菜单
  const handleAuth = async (event, record) => {
    event.stopPropagation()

    requestMenuByRoleId(record)
  }

  // 不通过刷新列表请求修改列表状态
  const onChangeStatus = (checked, record) => {
    // console.log(checked)
    // console.log(record)
    confirm({
      title: `此操作将 "${checked ? '启用' : '停用'}" ${record.roleName}, 是否继续？`,
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk: async () => {
        const res = await openOrClose({ roleId: record.roleId, status: checked ? '0' : '1' })
        if (res.code === 200) {
          const tableData = tableRef.current.getDataSource()
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i].roleId === record.roleId) {
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
      title: '角色名',
      dataIndex: 'roleName',
      key: 'roleName',
      // width: 200,
      // ellipsis: true,
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      key: 'roleKey',
    },
    {
      title: '排序',
      dataIndex: 'roleSort',
      key: 'roleSort',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={text === '0'} onChange={(checked) => onChangeStatus(checked, record)} />
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
          { title: '菜单权限', method: (e) => handleAuth(e, record) },
          { title: '编辑', auth: 'system:role:edit', method: (e) => handleEdit(e, record) },
          { title: '删除', auth: 'system:role:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除角色编号为"${record.roleName}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 180
    }
  ]

  const tableProps = {
    rowKey: 'roleId',
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

  // 导出
  const onExport = async () => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认导出所有角色数据项?',
      onOk: async () => {
        const exportParams = tableRef.current.getSearchParamsValue()
        console.log(exportParams)
        const res = await exportRole(exportParams)
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
          <AuthButton auth='system:role:edit' type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</AuthButton>
          <AuthButton auth='system:role:export' type="warning" icon={<VerticalAlignBottomOutlined />} onClick={onExport} style={{marginLeft: '8px'}}>导出</AuthButton>
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
        formData.menuCheckStrictly = true       // 默认父子关联
        formData.deptCheckStrictly = true
        formData.deptIds = []
        formData.menuIds = []
        res = await addRole(formData)
        break;
      case 'update':
        formData.roleId = detail.roleId
        formData.menuIds = role.menuIds
        res = await updateRole(formData)
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

  // 保存授权菜单
  const onSaveMenuRole = async () => {
    const checkedKeys = menutreeRef.current.getCheckedKeys()
    const halfCheckedKeys = menutreeRef.current.getHalfCheckedKeys()
    console.log(checkedKeys)
    console.log(halfCheckedKeys)
    const pp = {
      roleId: role.roleId,
      roleSort: role.roleSort,
      roleKey: role.roleKey,
      roleName: role.roleName,
      // authList: checkedKeys.checked   // 非关联
      menuIds: checkedKeys.concat(halfCheckedKeys), // 关联
      menuCheckStrictly: true       // 默认父子关联
    }

    const res = await updateRole(pp)

    if (res.code === 200) {
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
            request={(params) => queryRole(params)}
          />
        }
        rightWidth={350}
        right={
          <div style={{ padding: 12, height: '100%' }}>
            <Card title={`${role.roleName ? `${role.roleName}-`: ''}菜单分配`} extra={<SageButton disabled={Object.keys(role).length === 0} type="primary" onClick={onSaveMenuRole} icon={<CheckOutlined />}>保存</SageButton>} size="small" style={{ height: '100%' }}>
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
