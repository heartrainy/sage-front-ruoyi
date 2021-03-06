import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { connect, dropByCacheKey } from 'umi'
import { SageTable, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { queryCrud, updateCrud, removeCrud, getCrudDetail } from './service';


// 详情数据
const initDetail = {
  id: null
}

const CrudList = (props) => {

  // 状态数据
  const [detail, setDetail] = useState(initDetail) // 详情
  const [editable, setEditable] = useState(true)   // 编辑按钮状态
  const [removeable, setRemoveable] = useState(true)   // 删除按钮状态

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const updateFormRef = useRef();

  useEffect(() => {

  }, [])

  // 查询条件
  const searchFields = [
    {
      name: 'field2',
      label: '字段2',
      type: 'input',
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field3',
      label: '字段3',     // (固定下拉数据)
      type: 'select',
      options: [
        { text: '选项1', value: 'select1' },
        { text: '选项2', value: 'select2' }
      ],
      props: {
        placeholder: '请输入',
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

    dropByCacheKey('/demo/tabcrud/edit')
    props.dispatch({
      type: 'global/goTab',
      payload: {
        path: `/demo/tabcrud/edit`,
        name: '编辑Crud',
        query: {
          id: record.id
        }
      }
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
      title: '字段1',
      dataIndex: 'field1',
      key: 'field1',
      width: 200,
    },
    {
      title: '字段2',
      dataIndex: 'field2',
      key: 'field2',
      width: 200,
      sortField: 't1.field2',
      sorter: true
    },
    {
      title: '字段3',
      dataIndex: 'field3',
      key: 'field3',
      width: 200,
    },
    {
      title: '字段4',
      dataIndex: 'field4',
      key: 'field4',
      width: 200,
    },
    {
      title: '字段5',
      dataIndex: 'field5',
      key: 'field5',
      width: 200,
    },
    {
      title: '字段6',
      dataIndex: 'field6',
      key: 'field6',
      width: 200,
    },
    {
      title: '字段7',
      dataIndex: 'field7',
      key: 'field7',
      width: 200,
    },
    {
      title: '字段8',
      dataIndex: 'field8',
      key: 'field8',
      width: 200,
    },
    {
      title: '字段9',
      dataIndex: 'field9',
      key: 'field9',
      width: 200,
    },
    {
      title: '字段10',
      dataIndex: 'field10',
      key: 'field10',
      width: 200,
    },
    {
      title: '字段11',
      dataIndex: 'field11',
      key: 'field11',
      width: 200,
    },
    {
      title: '字段12',
      dataIndex: 'field12',
      key: 'field12',
      width: 200,
    },
    {
      title: '字段13',
      dataIndex: 'field13',
      key: 'field13',
      width: 200,
    },
    {
      title: '字段14',
      dataIndex: 'field14',
      key: 'field14',
      width: 200,
    },
    {
      title: '字段15',
      dataIndex: 'field15',
      key: 'field15',
      width: 200,
    },
    {
      title: '字段16',
      dataIndex: 'field16',
      key: 'field16',
      width: 200,
    },
    {
      title: '字段17',
      dataIndex: 'field17',
      key: 'field17',
      width: 200,
    },
    {
      title: '字段18',
      dataIndex: 'field18',
      key: 'field18',
      width: 300,
    },
    {
      title: '字段19',
      dataIndex: 'field19',
      key: 'field19',
      width: 200,
    },
    {
      title: '字段20',
      dataIndex: 'field20',
      key: 'field20',
      width: 200,
    },
    {
      title: '字段21',
      dataIndex: 'field21',
      key: 'field21',
      width: 200,
    },
    {
      title: '字段22',
      dataIndex: 'field22',
      key: 'field22',
      width: 200,
    },
    {
      title: '字段23',
      dataIndex: 'field23',
      key: 'field23',
      width: 200,
    },
    {
      title: '字段24',
      dataIndex: 'field24',
      key: 'field24',
      width: 300,
    },
    {
      title: '字段25',
      dataIndex: 'field25',
      key: 'field25',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      sortField: 't1.created_At',
      sorter: true
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

    props.dispatch({
      type: 'global/goTab',
      payload: {
        path: '/demo/tabcrud/add',
        name: '新增Crud'
      }
    })

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
          <SageButton type="success" icon={<EditOutlined />} onClick={(e) => onEdit(e)} disabled={editable} style={{marginLeft: '8px'}}>编辑</SageButton>
          <SageButton type="danger" icon={<DeleteOutlined />} onClick={(e) => onDelete(e)} disabled={removeable} style={{marginLeft: '8px'}}>删除</SageButton>
          <SageButton type="warning" icon={<VerticalAlignBottomOutlined />} onClick={(e) => onImport(e)} style={{marginLeft: '8px'}}>导入</SageButton>
          <SageButton type="warning" icon={<VerticalAlignTopOutlined />} onClick={(e) => onExport(e)} style={{marginLeft: '8px'}}>导出</SageButton>
        </>
      )
    },
    toolOptionConfig: ['reload', 'hiddensearch', 'density', 'fullScreen']
  }

  return (
    <PageHeaderWrapper>

      <SageTable
        ref={tableRef}
        {...tableSearchFormProps}
        {...tableToolProps}
        {...tableProps}
        request={(params) => queryCrud(params)}
      />

    </PageHeaderWrapper>
  )
}

export default connect(({ global }) => ({
  global
}))(CrudList)
