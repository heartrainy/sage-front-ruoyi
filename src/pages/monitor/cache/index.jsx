import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Row, Col, Spin } from 'antd'
import { SageCard, SageTable } from '@/components/Common'
import SageChart from '@/components/SageChart'
// import { SageChart } from 'sage-chart'
import { queryCache } from './service'
import './style.less'

const commandstatsOption = {
  
}

const Cache = () => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({})
  const [dbSize, setDbSize] = useState(0)
  const [commandStats, setCommandStats] = useState([])

  const commandstatsRef = useRef()
  const usedmemoryRef = useRef()

  const requestCache = async () => {
    setLoading(true)
    const res = await queryCache()
    if (res.code === 200) {
      const { data } = res
      setInfo(data.info)
      setDbSize(data.dbSize)
      setCommandStats(data.commandStats)
      initCommandstatsChart(data.commandStats)
      initUsedmemoryChart(data.info)
    }
    setLoading(false)
  }

  const initCommandstatsChart = (data) => {
    const echartObj = commandstatsRef.current.getInstance()
    echartObj.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      series: [
        {
          name: "命令",
          type: "pie",
          roseType: "radius",
          radius: [15, 95],
          center: ["50%", "38%"],
          data: data,
          animationEasing: "cubicInOut",
          animationDuration: 1000,
        },
      ]
    })
  }

  const initUsedmemoryChart = (data) => {
    const echartObj = usedmemoryRef.current.getInstance()
    echartObj.setOption({
      tooltip: {
        formatter: "{b} <br/>{a} : " + data.used_memory_human,
      },
      series: [
        {
          name: "峰值",
          type: "gauge",
          min: 0,
          max: 1000,
          detail: {
            formatter: data.used_memory_human,
          },
          data: [
            {
              value: parseFloat(data.used_memory_human),
              name: "内存消耗",
            },
          ],
        },
      ],
    })
  }

  useEffect(() => {
    requestCache()
  }, [])

  return (
    <PageHeaderWrapper>
      <Spin tip="Loading..." spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <SageCard title="基本信息" size="small">
              <table className="card-table" cellSpacing="0" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><div className="cell">Redis版本</div></td>
                    <td><div className="cell">{info.redis_version}</div></td>
                    <td><div className="cell">运行模式</div></td>
                    <td><div className="cell">{info.redis_mode == "standalone" ? "单机" : "集群"}</div></td>
                    <td><div className="cell">端口</div></td>
                    <td><div className="cell">{info.tcp_port}</div></td>
                    <td><div className="cell">客户端数</div></td>
                    <td><div className="cell">{info.connected_clients}</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">运行时间(天)</div></td>
                    <td><div className="cell">{info.uptime_in_days}</div></td>
                    <td><div className="cell">使用内存</div></td>
                    <td><div className="cell">{info.used_memory_human}</div></td>
                    <td><div className="cell">使用CPU</div></td>
                    <td><div className="cell">{parseFloat(info.used_cpu_user_children).toFixed(2)}</div></td>
                    <td><div className="cell">内存配置</div></td>
                    <td><div className="cell">{info.maxmemory_human}</div></td>
                  </tr>
                  <tr>
                    <td><div className="cell">AOF是否开启</div></td>
                    <td><div className="cell">{info.aof_enabled == "0" ? "否" : "是"}</div></td>
                    <td><div className="cell">RDB是否成功</div></td>
                    <td><div className="cell">{info.rdb_last_bgsave_status}</div></td>
                    <td><div className="cell">Key数量</div></td>
                    <td><div className="cell">{dbSize}</div></td>
                    <td><div className="cell">网络入口/出口</div></td>
                    <td><div className="cell">{`${info.instantaneous_input_kbps}kps/${info.instantaneous_output_kbps}kps`}</div></td>
                  </tr>
                </tbody>
              </table>
            </SageCard>
          </Col>

          <Col span={12}>
            <SageCard title="命令统计" size="small">
              <SageChart ref={commandstatsRef} id="cache-chart-1" style={{height: '420px'}} />
            </SageCard>
          </Col>

          <Col span={12}>
            <SageCard title="内存信息" size="small">
              <SageChart ref={usedmemoryRef} id="cache-chart-2" style={{height: '420px'}} />
            </SageCard>
          </Col>

          
        </Row>
      </Spin>
    </PageHeaderWrapper>
  );
}

export default Cache;
