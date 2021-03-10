import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Descriptions } from 'antd'
import { selectDictLabel } from '@/utils/utils'

const ViewForm = (props) => {

  const { detail, jobGroupOptions, jobStatusOptions } = props

  return (
    <Descriptions column={2}>
      <Descriptions.Item label="日志编号">{detail.jobLogId}</Descriptions.Item>
      <Descriptions.Item label="任务分组">{selectDictLabel(jobGroupOptions, detail.jobGroup)}</Descriptions.Item>
      <Descriptions.Item label="任务名称">{detail.jobName}</Descriptions.Item>
      <Descriptions.Item label="执行时间">{detail.createTime}</Descriptions.Item>
      <Descriptions.Item label="调用方法" span={2}>{detail.invokeTarget}</Descriptions.Item>
      <Descriptions.Item label="日志信息" span={2}>{detail.jobMessage}</Descriptions.Item>
      <Descriptions.Item label="执行状态">{selectDictLabel(jobStatusOptions, detail.status)}</Descriptions.Item>
    </Descriptions>
  )
}

export default ViewForm
