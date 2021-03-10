import React from 'react'
import { Descriptions } from 'antd'
import { selectDictLabel } from '@/utils/utils'

const ViewForm = (props) => {

  const { detail, jobGroupOptions, jobStatusOptions } = props

  return (
    <Descriptions column={2}>
      <Descriptions.Item label="任务编号">{detail.jobId}</Descriptions.Item>
      <Descriptions.Item label="任务分组">{selectDictLabel(jobGroupOptions, detail.jobGroup)}</Descriptions.Item>
      <Descriptions.Item label="任务名称">{detail.jobName}</Descriptions.Item>
      <Descriptions.Item label="创建时间">{detail.createTime}</Descriptions.Item>
      <Descriptions.Item label="cron表达式">{detail.cronExpression}</Descriptions.Item>
      <Descriptions.Item label="下次执行时间">{detail.nextValidTime}</Descriptions.Item>
      <Descriptions.Item label="调用目标方法" span={2}>{detail.invokeTarget}</Descriptions.Item>
      <Descriptions.Item label="任务状态">{selectDictLabel(jobStatusOptions, detail.status)}</Descriptions.Item>
      <Descriptions.Item label="是否并发">{detail.concurrent === '0' ? '允许' : '禁止'}</Descriptions.Item>
      <Descriptions.Item label="执行策略">{detail.concurrent === '1' ? '立即执行' : detail.concurrent === '2' ? '执行一次' : '放弃执行'}</Descriptions.Item>
    </Descriptions>
  )
}

export default ViewForm
