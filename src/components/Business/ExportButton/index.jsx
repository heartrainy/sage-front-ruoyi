import React from 'react'
import { SageButton } from '../../Common'
import './style.less'


/**
 *
 * @param {*} props
 * exportParams // 导出条件
 * exportService // 导出service方法
 */
const ExportButton = (props) => {
  const { exportParams = {}, exportService, ...otherProps} = {
    ...props
  }

  const onExport = async () => {
    const res = await exportService(exportParams)
    const blob = new Blob([res.data]);
    const filename = res.response.headers.get('Content-Disposition').split(';')[1].split('filename=')[1]
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a');
      elink.download = decodeURIComponent(filename);
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, decodeURIComponent(filename));
    }
  }

  return (
    <SageButton {...otherProps} onClick={onExport} />
  )
}

export default ExportButton
