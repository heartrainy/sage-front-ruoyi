import React, { useState, useImperativeHandle, useRef } from 'react'
import { Modal, Switch } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SageModal, SageTable, ActionSet, SageMessage } from '@/components/Common'
import { queryUser, openOrClose } from "@/pages/system/user/service";


const { confirm } = Modal

/**
 * 选择人员弹窗
 */
const PersonModel = (props, ref) => {

  const tableRef = useRef()
  const [visible, setVisible] = useState(false)
  const [single, setSingle] = useState(true) // 非单个禁用
  const [multiple, setMultiple] = useState(true)  // 非多个禁用

  const { isSingle = true } = props;


  // 点击窗口确定按钮
  const onOk = () => {
    const chooseList = tableRef.current.getSelectedRows()
    if (chooseList.length === 0) {
      SageMessage.warning('请至少选择一项记录')
      return
    }

    const chooseKeyList = tableRef.current.getSelectedRowKeys()
    if (props.onChoose) {
      props.onChoose(chooseList, chooseKeyList)
    }

    setVisible(false)
  }

  // 编辑
  const handleChoose = async (event, record) => {
    event.stopPropagation()

    if (props.onChoose) {
      props.onChoose(record)
    }

    setVisible(false)
  }

  // 关闭窗口
  const handleCancel = () => {
    setVisible(false)
  }

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
    }
  ]

  if (isSingle) {
    columns.push(
      {
        title: '操作',
        fixed: 'right',
        dataIndex: 'button',
        key: 'action',
        align: 'center',
        render: (button, record) => {
  
          const actionList = [
            { title: '选择', method: (e) => handleChoose(e, record) },
          ]
  
          return <ActionSet actionList={actionList} record={record} />
        },
        width: 120
      }
    )
  }

  const tableProps = {
    rowKey: 'userId',
    // hasNumber: true,
    hasCheck: !isSingle,
    columns,
    // scroll: { x: '100vw' },
    hiddeTool: true,
    onSelectedRow: (selectedrowkeys, selectedrows) => {
      console.log(selectedrowkeys)
      setSingle(selectedrowkeys.length !== 1)
      setMultiple(!selectedrowkeys.length)
    }
  }

  const footerConfig = {}
  if (isSingle) {
    footerConfig.footer = null
  }

  // 暴露外部方法
  useImperativeHandle(ref, () => ({
    setVisible: (bool) => setVisible(bool)
  }))

  return (
    <SageModal
      visible={visible}
      width={1000}
      title="选择人员"
      onCancel={handleCancel}
      destroyOnClose
      onOk={onOk}
      {
        ...footerConfig
      }
    >
      <div>
        <SageTable
          ref={tableRef}
          {...tableSearchFormProps}
          {...tableProps}
          request={(params) => {
            return queryUser(params)
          }}
        />
      </div>
    </SageModal>
  )

}

export default React.forwardRef(PersonModel)
