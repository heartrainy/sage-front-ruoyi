import React, { useEffect } from 'react'
// import * as echarts from 'echarts';

const Line = () => {

  // useEffect(() => {
  //   // 基于准备好的dom，初始化echarts实例
  //   const myChart = echarts.init(document.getElementById('demo-bar-1'));
  //   // 绘制图表
  //   myChart.setOption({
  //     xAxis: {
  //       type: 'category',
  //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [{
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'bar',
  //       showBackground: true,
  //       backgroundStyle: {
  //         color: 'rgba(220, 220, 220, 0.8)'
  //       }
  //     }]
  //   });

  //   // 高宽度自适应
  //   window.addEventListener("resize", () => {
  //     myChart.resize();
  //   });

  // }, [])

  return (
    <div class="sage-page-wrapper">
      <div id="demo-bar-1" className="sage-chart-card"></div>
    </div>

  )
}

export default Line