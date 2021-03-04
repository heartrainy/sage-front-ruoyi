import React, { useState, useEffect, useRef } from 'react'
import KeepAlive from 'react-activation'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { connect } from 'umi'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import AuthButton from '@/components/AuthButton'
import { createFromIconfontCN, PlusOutlined, EditOutlined, ReloadOutlined, SwapOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { queryMenu, updateMenu, addMenu, removeMenu, getMenuDetail } from './service';
import { getEnumDropDownList } from '@/services/enum'
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'
import { handleTree, selectDictLabel } from '@/utils/utils'


// 详情数据
const initDetail = {
  id: null
}

const MenuList = (props) => {
  const { settings } = props

  // 状态数据
  const [detail, setDetail] = useState(initDetail) // 详情
  const [editable, setEditable] = useState(true)   // 编辑按钮状态
  const [removeable, setRemoveable] = useState(true)   // 删除按钮状态
  const [status, setStatus] = useState('') // 状态 1、add 2、update 3、detail
  const [modalLoading, setModalLoading] = useState(false) // 窗口loading
  const [visibleOptions, setVisibleOptions] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [parentId, setParentId] = useState('0')

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  const IconFont = createFromIconfontCN({
    scriptUrl: settings.iconfontUrl,
  });

  // 是否可见Options
  const requestVisibleOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_show_hide' })
    if (res.code === 200) {
      setVisibleOptions(res.data)
    }
  }

  // 状态Options
  const requestStatusOptions = async () => {
    const res = await getEnumDropDownList({ type: 'sys_normal_disable' })
    if (res.code === 200) {
      setStatusOptions(res.data)
    }
  }

  useEffect(() => {
    requestStatusOptions()
    requestVisibleOptions()
  }, [])

  // 查询条件
  const searchFields = [
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'input',
      props: {
        placeholder: '请输入菜单名称',
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
        placeholder: '菜单状态',
        allowClear: true
      }
    },
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

  // 新增
  const handleAdd = (event, record) => {
    event.stopPropagation()

    console.log(record.menuId)
    onAdd(record.menuId)
  }

  // 编辑
  const handleEdit = async (event, record) => {
    event.stopPropagation()

    modalRef.current.setTitle('编辑')
    modalRef.current.setVisible(true)

    setStatus('update')
    const res = await getMenuDetail({ menuId: record.menuId })
    const { data } = res
    setDetail(data)

    updateFormRef.current.setFieldsValue({
      parentId: data.parentId,
      menuType: data.menuType,
      menuName: data.menuName,
      path: data.path,
      isFrame: data.isFrame,
      perms: data.perms,
      component: data.component,
      orderNum: data.orderNum,
      icon: data.icon,
      visible: data.visible,
      status: data.status,
      isCache: data.isCache
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeMenu({ menuId: record.menuId })
    if (res.code === 200) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 表格
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 200,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: text => text ? <IconFont type={`icon-${text}`} /> : ''
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 100,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      key: 'perms',
      width: 200
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      // width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => selectDictLabel(statusOptions, text)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'button',
      key: 'action',
      align: 'center',
      render: (button, record) => {

        const actionList = [
          { title: '编辑', auth: 'system:menu:edit', method: (e) => handleEdit(e, record) },
          { title: '新增', auth: 'system:menu:add', method: (e) => handleAdd(e, record) },
          { title: '删除', auth: 'system:menu:remove', method: (e) => handleDelete(e, record), isConfirm: true, confirmInfo: `是否确认删除名称为"${record.menuName}"的数据项?` },
        ]

        return <ActionSet actionList={actionList} record={record} />
      },
      // width: 120
    }
  ]

  const renderMenuData = data => {
    // 生成树结构
    const tempData = handleTree(data, 'menuId')
    // 去除空数组
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
    // console.log(tempData)

    return tempData
  }

  const tableProps = {
    rowKey: 'menuId',
    // hasCheck: true,
    columns,
    // scroll: { x: '100vw' },
    pagination: false,
    expandable: true,
    rowSelection: {
      type: 'radio',
      onChange: (selectedrowkeys, selectedrows) => {
        tableRef.current.setSelectedRowKeys(selectedrowkeys)
        tableRef.current.setSelectedRows(selectedrows)
        setEditable(selectedrowkeys.length !== 1)
        setRemoveable(selectedrowkeys.length === 0)
      }
    }
  }

  // 新建按钮
  const onAdd = (menuId) => {
    if (menuId) {
      setParentId(menuId)
    } else {
      setParentId('0')
    }

    if (modalRef.current) {
      setStatus('add')
      modalRef.current.setTitle('新增')
      modalRef.current.setVisible(true)
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
    const res = await removeMenu({ idArr: rowRecords })
    if (res.code === 200) {
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
          <AuthButton auth="system:menu:add" type="primary" icon={<PlusOutlined />} onClick={() => onAdd()}>新增</AuthButton>
          {/* <SageButton type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={editable} style={{marginLeft: '8px'}}>编辑</SageButton> */}
          <AuthButton type="waring" icon={<SwapOutlined />} onClick={(e) => onExpand(e)} style={{ marginLeft: '8px' }}>全部展开/折叠</AuthButton>
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
    // if (formData.menuType === '2') {
    //   formData.status = '1'
    // }

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addMenu(formData)
        break;
      case 'update':
        formData.menuId = detail.menuId
        res = await updateMenu(formData)
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
        request={(params) => queryMenu(params)}
        dataParamName="data"
        renderData={data => renderMenuData(data)}
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
              parentId={parentId}
              visibleOptions={visibleOptions}
              statusOptions={statusOptions}
            /> : null
        }
        {
          status === 'update' ?
            <UpdateForm
              ref={updateFormRef}
              detail={detail}
              onFinish={onFinish}
              visibleOptions={visibleOptions}
              statusOptions={statusOptions}
            /> : null
        }
      </SageModal>

    </PageHeaderWrapper>

  )
}

export default connect(({ settings }) => ({
  settings,
}))(MenuList);
