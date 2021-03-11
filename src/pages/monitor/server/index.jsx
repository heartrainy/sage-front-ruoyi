import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Row, Col, Spin } from 'antd'
import { SageCard, SageTable } from '@/components/Common'
import { queryServer } from './service'
import './style.less'


function Server() {
  const [loading, setLoading] = useState(false)
  const [cpu, setCpu] = useState({})
  const [jvm, setJvm] = useState({})
  const [mem, setMem] = useState({})
  const [sys, setSys] = useState({})
  const [sysFiles, setSysFiles] = useState([])

  const requestServer = async () => {
    setLoading(true)
    const res = await queryServer()
    if (res.code === 200) {
      const { data } = res
      setCpu(data.cpu)
      setJvm(data.jvm)
      setMem(data.mem)
      setSys(data.sys)
      setSysFiles(data.sysFiles)
    }
    setLoading(false)
  }

  useEffect(() => {
    requestServer()
  }, [])

  return (
    <PageHeaderWrapper>
      <Spin tip="Loading..." spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <SageCard title="CPU" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th width="50%"><div className="cell">属性</div></th>
                    <th><div className="cell">值</div></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><div className="cell">核心数</div></td>
                    <td><div className="cell">{cpu.cpuNum}</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">用户使用率</div></td>
                    <td><div className="cell">{cpu.used}%</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">系统使用率</div></td>
                    <td><div className="cell">{cpu.sys}%</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">当前空闲率</div></td>
                    <td><div className="cell">{cpu.free}%</div></td>
                  </tr>
                </tbody>
              </table>
            </SageCard>
          </Col>
          <Col span={12}>
            <SageCard title="内存" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th width="33%"><div className="cell">属性</div></th>
                    <th width="33%"><div className="cell">内存</div></th>
                    <th><div className="cell">JVM</div></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><div className="cell">总内存</div></td>
                    <td><div className="cell">{mem.total}G</div></td>
                    <td><div className="cell">{jvm.total}M</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">已用内存</div></td>
                    <td><div className="cell">{mem.used}G</div></td>
                    <td><div className="cell">{jvm.used}M</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">剩余内存</div></td>
                    <td><div className="cell">{mem.free}G</div></td>
                    <td><div className="cell">{jvm.free}M</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">使用率</div></td>
                    <td><div className={`cell ${mem.usage > 80 ? 'text-danger' : ''}`}>{mem.usage}%</div></td>
                    <td><div className={`cell ${jvm.usage > 80 ? 'text-danger' : ''}`}>{jvm.usage}%</div></td>
                  </tr>
                </tbody>
              </table>
            </SageCard>
          </Col>

          <Col span={24}>
            <SageCard title="服务器信息" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td width="25%"><div className="cell">服务器名称</div></td>
                    <td width="25%"><div className="cell">{sys.computerName}</div></td>
                    <td width="25%"><div className="cell">操作系统</div></td>
                    <td><div className="cell">{sys.osName}</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">服务器IP</div></td>
                    <td><div className="cell">{sys.computerIp}</div></td>
                    <td><div className="cell">系统架构</div></td>
                    <td><div className="cell">{sys.osArch}</div></td>
                  </tr>
                </tbody>
              </table>
            </SageCard>
          </Col>

          <Col span={24}>
            <SageCard title="Java虚拟机信息" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td width="15%"><div className="cell">Java名称</div></td>
                    <td width="35%"><div className="cell">{jvm.name}</div></td>
                    <td width="15%"><div className="cell">Java版本</div></td>
                    <td><div className="cell">{jvm.version}</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">启动时间</div></td>
                    <td><div className="cell">{jvm.startTime}</div></td>
                    <td><div className="cell">运行时长</div></td>
                    <td><div className="cell">{jvm.runTime}</div></td>
                  </tr>
                  <tr>
                    <td colSpan="1"><div className="cell">安装路径</div></td>
                    <td colSpan="3"><div className="cell">{jvm.home}</div></td>
                  </tr>
                  <tr>
                    <td colSpan="1"><div className="cell">项目路径</div></td>
                    <td colSpan="3"><div className="cell">{sys.userDir}</div></td>
                  </tr>
                </tbody>
              </table>
            </SageCard>
          </Col>

          <Col span={24}>
            <SageCard title="磁盘状态" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <th><div className="cell">盘符路径</div></th>
                    <th><div className="cell">文件系统</div></th>
                    <th><div className="cell">盘符类型</div></th>
                    <th><div className="cell">总大小</div></th>
                    <th><div className="cell">可用大小</div></th>
                    <th><div className="cell">已用大小</div></th>
                    <th><div className="cell">已用百分比</div></th>
                  </tr>
                  {
                    sysFiles.map((sysFile, index) => {
                      return (
                        <tr>
                          <td><div className="cell">{sysFile.dirName}</div></td>
                          <td><div className="cell">{sysFile.sysTypeName}</div></td>
                          <td><div className="cell">{sysFile.typeName}</div></td>
                          <td><div className="cell">{sysFile.total}</div></td>
                          <td><div className="cell">{sysFile.free}</div></td>
                          <td><div className="cell">{sysFile.used}</div></td>
                          <td><div className={`cell ${sysFile.usage > 80 ? 'text-danger' : ''}`}>{sysFile.usage}%</div></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </SageCard>
          </Col>
        </Row>
      </Spin>
    </PageHeaderWrapper>
  );
}

export default Server;
