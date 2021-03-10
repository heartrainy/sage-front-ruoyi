import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
import { Descriptions } from 'antd'
import { selectDictLabel } from '@/utils/utils'

const ViewForm = (props) => {

  const { detail, operTypeOptions, commonStatusOptions } = props

  return (
    <Descriptions column={2}>
      <Descriptions.Item label="操作模块">{`${detail.title} / ${selectDictLabel(operTypeOptions, detail.operatorType)}`}</Descriptions.Item>
      <Descriptions.Item label="请求地址">{detail.operUrl}</Descriptions.Item>
      <Descriptions.Item label="登录信息">{`${detail.operName} / ${detail.operIp} / ${detail.operLocation}`}</Descriptions.Item>
      <Descriptions.Item label="请求方式">{detail.requestMethod}</Descriptions.Item>
      <Descriptions.Item label="操作方式" span={2}>{detail.method}</Descriptions.Item>
      <Descriptions.Item label="请求参数" span={2}>{detail.operParam}</Descriptions.Item>
      <Descriptions.Item label="返回参数" span={2}>{detail.jsonResult}</Descriptions.Item>
      <Descriptions.Item label="操作状态">{selectDictLabel(commonStatusOptions, detail.status)}</Descriptions.Item>
      <Descriptions.Item label="操作时间">{detail.operTime}</Descriptions.Item>
    </Descriptions>
  )
}

export default ViewForm
