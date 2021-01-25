import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { connect } from 'umi'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { createFromIconfontCN, PlusOutlined, EditOutlined, ReloadOutlined, SwapOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { queryMenu, updateMenu, addMenu, removeMenu, getMenuDetail, clearMenu } from './service';
import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'



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

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  const IconFont = createFromIconfontCN({
    scriptUrl: settings.iconfontUrl,
  });

  useEffect(() => {

  }, [])

  // 查询条件
  const searchFields = [
    {
      name: 'menuName',
      label: '菜单名称',
      type: 'input',
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'status',
      label: '菜单状态',
      type: 'select',
      options: [
        {text: '显示', value: '1'},
        {text: '隐藏', value: '0'}
      ],
      props: {
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

  // 编辑
  const handleEdit = async (event, record) => {
    event.stopPropagation()

    modalRef.current.setTitle('编辑')
    modalRef.current.setVisible(true)

    setStatus('update')
    const res = await getMenuDetail({ id: record.id })
    const { data } = res
    setDetail(data)

    updateFormRef.current.setFieldsValue({
      parentId: data.parentId,
      menuType: data.menuType,
      menuName: data.menuName,
      url: data.url,
      target: data.target,
      perms: data.perms,
      orderNum: data.orderNum,
      icon: data.icon,
      status: data.status
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeMenu({ id: record.id })
    if (res.isSuccess) {
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
      title: '排序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 100,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: text => text ? <IconFont type={`icon-${text}`} /> : ''
    },
    {
      title: '路由地址',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      render: (text, record) => record.menuType === '0' || record.menuType === '1' ? text : ''
    },
    {
      title: '请求地址',
      dataIndex: 'url',
      key: 'url',
      // width: 200,
      render: (text, record) => record.menuType === '2' ? text : ''
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      width: 100,
      render: text => {
        let renderText = ''
        switch (text) {
          case '0':
            renderText = '目录'
            break;
          case '1':
            renderText = '菜单'
            break;
          case '2':
            renderText = '按钮'
            break;
          default:
            break;
        }
        return renderText
      }
    },
    {
      title: '可见',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => text === '1' ? '显示' : '隐藏'
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

        return <ActionSet actionList={actionList} record={record} />
      },
      width: 120
    }
  ]

  const renderMenuData = data => {
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
    const res = await removeMenu({ idArr: rowRecords })
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

  // 刷新缓存
  const onRefreshMenu = async () => {
    const res = await clearMenu()
    if (res.isSuccess) {
      SageMessage.success('菜单更新成功')
    }
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>
          <SageButton type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增</SageButton>
          {/* <SageButton type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={editable} style={{marginLeft: '8px'}}>编辑</SageButton> */}
          <SageButton type="success" icon={<ReloadOutlined />} onClick={onRefreshMenu} style={{marginLeft: '8px'}}>刷新菜单缓存</SageButton>
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
    if (formData.menuType === '2') {
      formData.status = '1'
    }

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addMenu(formData)
        break;
      case 'update':
        formData.id = detail.id
        res = await updateMenu(formData)
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
        request={(params) => queryMenu(params)}
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

export default connect(({ settings }) => ({
  settings,
}))(MenuList);
