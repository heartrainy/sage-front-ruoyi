import React, { useState, useEffect, useImperativeHandle } from 'react';
import * as echarts from 'echarts';
import './style.less';

const SageChart = (props, ref) => {
  const {
    id = '',
    className = '',
    style = {},
    option = {}
  } = props

  // 实例对象
  const [chart, setChart] = useState({})

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById(id));
    // 绘制图表
    myChart.setOption(option);

    setChart(myChart)

    // 高宽度自适应
    window.addEventListener("resize", () => {
      myChart.resize();
    });

  }, [])

  const lastClassName = `sage-chart-wrap ${className}`


  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    // 获取echart实例
    getInstance: () => chart
  }))

  return (
    <div id={id} className={lastClassName} style={style}></div>
  )
}

export default React.forwardRef(SageChart);