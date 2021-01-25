import React, { useState, useEffect, useRef } from 'react'
import { Table } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet, SageLayoutLR } from '@/components/Common'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getEnumDropDownList } from '@/services/enum'
import { queryCrud, updateCrud, addCrud, removeCrud, getCrudDetail } from './service';


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

  // ref对象
  const tableRef1 = useRef();
  const tableRef2 = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
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
  ]

  const searchFields2 = [
    {
      name: 'field3',
      label: '字段3',
      type: 'input',
      props: {
        placeholder: '请输入'
      }
    },
  ]

  // 查询
  const onSearchTable = (params) => {
    if (tableRef1.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件
      if (postParams.field19) {
        postParams.field19 = [
          moment(postParams.field19[0]).format('YYYY-MM-DD'),
          moment(postParams.field19[1]).format('YYYY-MM-DD'),
        ]
      }

      tableRef1.current.queryTable(postParams)
    }
  }

  const onSearchTable2 = (params) => {
    if (tableRef2.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件
      if (postParams.field19) {
        postParams.field19 = [
          moment(postParams.field19[0]).format('YYYY-MM-DD'),
          moment(postParams.field19[1]).format('YYYY-MM-DD'),
        ]
      }

      tableRef2.current.queryTable(postParams)
    }
  }

  // 重置
  const onResetTable = () => {
    if (tableRef1.current) {
      tableRef1.current.queryTable({ pageNum: 1 }, 'reset')
    }
  }

  const onResetTable2 = () => {
    if (tableRef2.current) {
      tableRef2.current.queryTable({ pageNum: 1 }, 'reset')
    }
  }

  const tableSearchFormProps1 = {
    searchFields,
    onSearchTable,
    onResetTable
  }

  const tableSearchFormProps2 = {
    searchFields: searchFields2,
    onSearchTable: onSearchTable2,
    onResetTable: onResetTable2
  }

  // 编辑
  const handleEdit = async (event, record) => {
    event.stopPropagation()

    setStatus('update')
    const res = await getCrudDetail({ id: record.id })
    const { data } = res
    setDetail(data)

    modalRef.current.setTitle('编辑')
    modalRef.current.setVisible(true)
    updateFormRef.current.setFieldsValue({
      field1: data.field1,
      field2: data.field2,
      field3: data.field3,
      field4: data.field4,
      field5: data.field5,
      field6: data.field6,
      field7: data.field7,
      field89: {
        field8: data.field8,
        field9: data.field9
      },
      field10: data.field10,
      field11: data.field11,
      field12: data.field12 === '1',
      field13: data.field13,
      field14: data.field14,
      field15: data.field15 ? JSON.parse(data.field15) : [],
      field16: data.field16 ? Number(data.field16) : 0,
      field17: data.field17,
      field18: data.field18 ? JSON.parse(data.field18) : [],
      field19: data.field19 ? moment(data.field19) : '',
      field20: data.field20,
      field21: data.field21,
      field22: data.field22 ? moment(data.field22) : '',
      field23: data.field23 ? moment(data.field23) : '',
      field24: data.field24 ? [moment(JSON.parse(data.field24)[0]), moment(JSON.parse(data.field24)[1])] : '',
      field25: data.field25 ? moment(data.field25, 'HH:mm:ss') : '',
      field26: data.field26,
      field27: data.field27 ? JSON.parse(data.field27) : [],
      field28: data.field28 ? JSON.parse(data.field28) : [],
    })
  }

  // 删除
  const handleDelete = async (event, record) => {
    event.stopPropagation()

    const res = await removeCrud({ idArr: [record.id] })
    if (res.isSuccess) {
      SageMessage.success('删除成功')
      tableRef.current.reloadTable()
    }
  }

  // 表格
  const columns1 = [
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
      sorter: true,
      hidden: true
    },
    {
      title: '字段3',
      dataIndex: 'field3',
      key: 'field3',
      width: 200,
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

  const columns2 = [
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
      sorter: true,
      hidden: true
    },
    {
      title: '字段4',
      dataIndex: 'field4',
      key: 'field4',
      width: 200,
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

  const tableProps1 = {
    rowKey: 'id',
    hasNumber: true,
    hasCheck: true,
    columns: columns1,
    scroll: true
  }

  const tableProps2 = {
    rowKey: 'id',
    hasNumber: true,
    hasCheck: true,
    columns: columns2,
    scroll: true
  }

  // 表格按钮操作
  const tableToolProps = {
    toolBarRender: () => {
      return (
        <>

        </>
      )
    },
    // toolOptionConfig: ['reload', 'hiddensearch', 'density', 'fullScreen']
  }

  const changeStatus = (value) => {
    setStatus(value)
  }

  return (
    <PageHeaderWrapper>
      <SageButton onClick={() => changeStatus('add')}>按钮1</SageButton>
      <SageButton onClick={() => changeStatus('update')}>按钮2</SageButton>
      {
        status === '' ?
          null : status === 'add' ?
            <SageTable
              ref={tableRef1}
              rowKey='id'
              // hasNumber
              // hasCheck
              columns={columns1}
              //request={(params) => queryCrud(params)}
            /> : status === 'update' ?
              <SageTable
                ref={tableRef2}
                rowKey='id'
                // hasNumber
                // hasCheck
                columns={columns2}
                // request={(params) => queryCrud(params)}
              /> : null
      }

      {/* <div style={{display: 'flex'}}>
        <div style={{flex: 1, width: '50%'}}>
          <SageTable
            ref={tableRef1}
            {...tableSearchFormProps1}
            {...tableToolProps}
            {...tableProps1}
            request={(params) => queryCrud(params)}
          />
        </div>
        <div style={{flex: 1 , width: '50%'}}>
          <SageTable
            ref={tableRef2}
            {...tableSearchFormProps2}
            {...tableToolProps}
            {...tableProps2}
            request={(params) => queryCrud(params)}
          />
        </div>
      </div> */}

    </PageHeaderWrapper>
  )
}

export default CrudList
