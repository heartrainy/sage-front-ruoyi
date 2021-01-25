import React, { useEffect } from 'react'
// import * as echarts from 'echarts';

const Pie = () => {

  useEffect(() => {
    // 基于准备好的dom，初始化echarts实例
    // const myChart = echarts.init(document.getElementById('demo-pie-1'));
    // // 绘制图表
    // myChart.setOption({
    //   title: {
    //     text: '某站点用户访问来源',
    //     subtext: '纯属虚构',
    //     left: 'center'
    //   },
    //   tooltip: {
    //     trigger: 'item'
    //   },
    //   legend: {
    //     orient: 'vertical',
    //     left: 'left',
    //   },
    //   series: [
    //     {
    //       name: '访问来源',
    //       type: 'pie',
    //       radius: '50%',
    //       data: [
    //         { value: 1048, name: '搜索引擎' },
    //         { value: 735, name: '直接访问' },
    //         { value: 580, name: '邮件营销' },
    //         { value: 484, name: '联盟广告' },
    //         { value: 300, name: '视频广告' }
    //       ],
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }
    //   ]
    // });

    // // 高宽度自适应
    // window.addEventListener("resize", () => {
    //   myChart.resize();
    // });

  }, [])

  return (
    <div class="sage-page-wrapper">
      <div id="demo-pie-1" className="sage-chart-card"></div>
    </div>

  )
}

export default Pie