import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { SageTable, SageModal, SageButton, SageMessage, ActionSet } from '@/components/Common'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getEnumDropDownList } from '@/services/enum'
import { queryCrud, updateCrud, addCrud, removeCrud, getCrudDetail } from './service';
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

  // 初始化数据
  const [selectOptions1, setSelectOptions1] = useState([])
  const [selectOptions2, setSelectOptions2] = useState([])

  // 初始化下拉数据
  const initSelectOptions = async () => {
    const res = await getEnumDropDownList({
      code: 'DEVICE_CONTROL_TYPE,DEVICE_FUNCTION_TYPE'
    })
    if (res.isSuccess) {
      const { DEVICE_CONTROL_TYPE, DEVICE_FUNCTION_TYPE } = res.data
      DEVICE_CONTROL_TYPE && DEVICE_CONTROL_TYPE.forEach(item => {
        item.text = item.dictValue
        item.value = item.dictKey
      })
      DEVICE_FUNCTION_TYPE && DEVICE_FUNCTION_TYPE.forEach(item => {
        item.text = item.dictValue
        item.value = item.dictKey
      })
      setSelectOptions1(DEVICE_CONTROL_TYPE || [])
      setSelectOptions2(DEVICE_FUNCTION_TYPE || [])
    }
  }

  // ref对象
  const tableRef = useRef();
  const modalRef = useRef();
  const createFormRef = useRef();
  const updateFormRef = useRef();

  useEffect(() => {
    initSelectOptions()
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
    },
    {
      name: 'field4',
      label: '字段4',     // (请求下拉数据)
      type: 'select',
      options: selectOptions1,
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field5',
      label: '字段5',     // (请求下拉数据)
      type: 'select',
      options: selectOptions2,
      props: {
        placeholder: '请输入'
      }
    },
    {
      name: 'field17',
      label: '字段17',
      type: 'treeselect',
      props: {
        placeholder: '请选择',
        treeData: [
          { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] }
        ]
      }
    },
    {
      name: 'field19',
      label: '字段19',
      type: 'rangepicker',
      props: {
        style: { width: '100%' }
      }
    },
  ]

  // 查询
  const onSearchTable = (params) => {
    if (tableRef.current) {
      const postParams = Object.assign({ pageNum: 1 }, params)
      // 处理查询条件
      if (postParams.field19) {
        postParams.field19 = [
          moment(postParams.field19[0]).format('YYYY-MM-DD'),
          moment(postParams.field19[1]).format('YYYY-MM-DD'),
        ]
      }

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
    isCacheCheck: true,
    // rowSelection: {
    //   onChange: (selectedrowkeys, selectedrows) => {
    //     tableRef.current.setSelectedRowKeys(selectedrowkeys)
    //     tableRef.current.setSelectedRows(selectedrows)
    //     setEditable(selectedrowkeys.length !== 1)
    //     setRemoveable(selectedrowkeys.length === 0)
    //   }
    // }
    // 选中checkbox返回
    onSelectedRow: (selectedrowkeys, selectedrows) => {
      setEditable(selectedrowkeys.length !== 1)
      setRemoveable(selectedrowkeys.length === 0)
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
    if (res.isSuccess) {
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
    // toolOptionConfig: ['reload', 'hiddensearch', 'density', 'fullScreen']
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
    formData.field1 = '字段1的值'
    // 多字段
    formData.field8 = values.field89.field8
    formData.field9 = values.field89.field9
    delete formData.field89
    // 开关
    formData.field12 = values.field12 ? '1' : '0'
    // 时间
    formData.field19 = values.field19 ? values.field19.format('YYYY-MM-DD') : ''
    formData.field22 = values.field22 ? values.field22.format('YYYY-MM-DD HH:mm:ss') : ''
    formData.field23 = values.field23 ? values.field23.format('YYYY-MM') : ''
    formData.field24 = values.field24 ? [values.field24[0].format('YYYY-MM-DD'), values.field24[1].format('YYYY-MM-DD')] : []
    formData.field25 = values.field25 ? values.field25.format('HH:mm:ss') : ''

    let res = null
    setModalLoading(true)
    switch (status) {
      case 'add':
        res = await addCrud(formData)
        break;
      case 'update':
        formData.id = detail.id
        res = await updateCrud(formData)
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
        request={(params) => queryCrud(params)}
      />

      <SageModal
        ref={modalRef}
        onOk={onOk}
        width={status === 'add' ? 600 : 1000}
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
